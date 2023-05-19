import asyncio
import json
import time
from pycognito import Cognito
from pycognito.exceptions import SoftwareTokenMFAChallengeException
import websockets
import nest_asyncio
import threading
import datetime
from collections import deque
nest_asyncio.apply()

uriJson = "wss://mlink.spiderrockconnect.com/mlink/json"
apiKey = 'your apikey'
password = 'your password'
authentication_key = f"{apiKey}.{password}"

async def recv_msg(websocket):
    buffer = await websocket.recv()
    result = json.loads(buffer)
    print(result)
    
    message = result['message']
    not_done = message.get('state', None) != 'Complete'
    return not_done

async def query_mlink(authentication_key):
    retry = True
    while retry:
        try:
            async with websockets.connect(uriJson, 
                                          extra_headers={"Authorization": f"Bearer {authentication_key}"},
                                           ping_timeout=None) as websocket:
                msg = {
                    "header": {
                        "mTyp": "MLinkQuery"
                    },
                    "message": {
                        "queryLabel": "ExampleStockNbbo",
                        "queryType": "FullSubscription",
                        "MsgType": [{"msgType": 2960, "view":"bidprice1|askprice1", "where":"bidprice1:lt:40 & askprice1:lt:40"}],
                        "msgNameFilter": "StockBookQuote"
                    }
                }
                t = time.time_ns()
                tstr = '.'.join([time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(t / 1000000000)), "%06d" % ((t / 1000) % 1000000)])
                msg['header']['sTim'] = tstr
                msg['header']['encT'] = tstr
                smsg = json.dumps(msg)
                await websocket.send(smsg)
                notDone = True
                while notDone:
                    notDone = await recv_msg(websocket)
                retry = False
        except asyncio.exceptions.TimeoutError:
            print("timeout occurred, retrying...")


if __name__ == "__main__":
    asyncio.run(query_mlink(authentication_key))