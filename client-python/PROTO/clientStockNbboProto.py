import asyncio
import time
from pycognito import Cognito
from pycognito.exceptions import SoftwareTokenMFAChallengeException
import websockets
import nest_asyncio
import datetime
#import <messages needed to query> as sr_messages #these are the compiled messages by token found in proto_files
import spiderrock_common_pb2 as sr_common
import google
import requests
import json

def getMessageMappings(authentication_key):
    pool = google.protobuf.descriptor_pool.Default()
    desc_MLinkResponse = pool.FindMessageTypeByName('spiderrock.protobuf.MLinkResponse')
    factory = google.protobuf.message_factory.MessageFactory()
    msg_MLinkResponse = factory.GetPrototype(desc_MLinkResponse)

    msgs = dict()

    msgs[3315] = ['MLinkResponse', msg_MLinkResponse]

    x = requests.get(f'https://mlink.spiderrockconnect.com/rest/jsonf?apikey={authentication_key}&cmd=getmsgtypes');
    parts = x.text.split('\r\n')
    for p in parts:
        if p.startswith('J03330'):
            msg = json.loads(p[12:])
            name = msg['message']['name']
            number = msg['message']['mNum']
            cls = None
            try:
                desc = pool.FindMessageTypeByName(f'spiderrock.protobuf.{name}')
                cls = factory.GetPrototype(desc)
            except:
                cls = None
            msgs[number] = [name, cls]
    return msgs


nest_asyncio.apply()

uriProto = "wss://mlink.spiderrockconnect.com/mlink/proto"
apiKey = ''
password = ''
authentication_key = f"{apiKey}.{password}"

msgs = getMessageMappings(authentication_key)

print(msgs)
async def query_mlink(authentication_key):
    retry = True
    while retry:
        try:
            async with websockets.connect(uriProto,
                                          extra_headers={"Authorization": f"Bearer {authentication_key}"},
                                           ping_timeout=None) as websocket:

                # Create the protobuf message
                mlink_query = sr_messages.MLinkQuery()
                mlink_query.query_label = "Example1"
                mlink_query.query_type = sr_common.MLINKQUERYTYPE_FULL_QUERY
                mlink_query.descriptor.message_type = "MLinkQuery"
                msg_type = mlink_query.msg_type.add()
                msg_type.msg_type = 2960
                tkey_filter = mlink_query.tkey_filters.add()
                tkey_filter.ticker_key.asset_type = sr_common.ASSETTYPE_EQT
                tkey_filter.ticker_key.ticker_src = sr_common.TICKERSRC_NMS
                tkey_filter.ticker_key.ticker = "AAPL"

                # Serialize the protobuf message
                serialized_msg = mlink_query.SerializeToString()
                # Send the serialized message with the header
                header = b'\r\nP03310' + b'%06d' % len(serialized_msg)
                await websocket.send(header + serialized_msg)

                notDone = True
                while notDone:
                    buffer = await websocket.recv()
                    parts = list(filter(None,buffer.split(b'\r\n')))
                    for msg in parts:
                        # Deserialize the received message using protobuf
                        messageTypeNumber = int(msg[2:6])
                        if messageTypeNumber not in msgs:
                            continue
                        cls_factory = msgs[messageTypeNumber][1]
                        if cls_factory == None:
                            continue;
                        result = cls_factory()
                        result.ParseFromString(msg[12:])
                        notDone = msgs[messageTypeNumber][0] != 'MLinkResponse' or result.state != sr_common.MLINKSTATE_COMPLETE
                        print(result, '\n')
                retry = False
        except asyncio.exceptions.TimeoutError:
            print("timeout occurred, retrying...")

if __name__ == "__main__":
    asyncio.run(query_mlink(authentication_key))
