import asyncio
import json
import time
from pycognito import Cognito
from pycognito.exceptions import SoftwareTokenMFAChallengeException
import websockets
import nest_asyncio
import threading
import datetime
nest_asyncio.apply()

uriJson = "wss://mlink.spiderrockconnect.com/mlink/json"
apiKey = 'your api key'
password = 'your api PW'
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
                        "mTyp": "MLinkSubscribe"
                    },
                    "message": {
                        "activeLatency": 1, #you can stream AAPL with minimum latency
                        "doReset":"No",
                        "View":[{"msgName": "StockBookQuote", "view":"askPrice1|bidPrice1"},{"msgName": "OptionNbboQuote", "view":"askPrice|bidPrice|bidSize|askSize"}], #each View is associated to a subscribe/unsubscribe parameter
                        "Subscribe": [{"msgName": "StockBookQuote", "msgPKey":"AAPL-NMS-EQT"},{"msgName": "OptionNbboQuote", "msgPKey":"AAPL-NMS-EQT-2023-07-28-180-C"}],
                        #"Unsubscribe": [{"msgName": "StockBookQuote", "msgPKey":"AAPL-NMS-EQT"}] 
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

