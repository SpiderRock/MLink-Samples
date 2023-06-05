<img src="https://data-portal.spiderrock.net/imgs/SpiderRock-Horizontal-Logo.png" width="400" alt="SpiderRock">

The SpiderRock MLink API provides access to live-data objects (Real-Time and delayed data feeds) within the SpiderRock system. This repo provides documentation and code samples for how developers can connect to MLink and consume the data returned.

MLink provides the several options:
* 6 product categories each with associated tokens to stream or query SR data
* 18 tokens for scoped access to message types
* 3 message delivery protocols: JSON, Framed JSON or Protobuf
* Query-based (REST) or streaming (Websocket) connections
* Real-time or delayed data
* Authentication via API Key or JWT

# Messages
Messages are organized into Message Types that are grouped and permissioned by the following Tokens

| Token                 | Description |
|-----------------------|---------------------------------------------------------------------------------|
| EqtMktData            | Stock quote and prints |
| FutMktData            | Futures quote and prints |
| OptMktData            | Options quote and prints |
| EqtSummaryData        | Stock market summaries |
| FutSummaryData        | Futures market summaries |
| OptSummaryData        | Options market summaries |
| EqtMarkData           | Stock open and close marks |
| FutMarkData           | Futures open and close (settlement) marks |
| OptMarkData           | Options open and close marks (includes surface marks and closing greeks) |
| EqtExchImbalance      | Stock market auction imbalances |
| OptAnalytics          | Options surfaces, at-the-money volatility and related |
| OptLiveRisk           | Options implied quotes and risk slides |
| OptionDefinition     | Production definitions for options |
| FutureDefinition     | Production definitions for futures |
| EquityDefinition     | Production definitions for equities |
| GLobalDefinition     | Dividends, EarningsCalendars, Rates, StockBetas |
| MLinkWs               | MLink WebSocket admin messages |
| MLinkRest             | MLink HTTP/REST admin messages |

## Message Patterns
All MLink messages are generated from a common IDL schema and follow common patterns, including the following:

1. **Live Data Objects with Primary Key:**

    These messages have a well-defined primary key (unique per message type) and follow a create/replace pattern such that any new message arriving in MLink will completely replace the previous record with the same primary key, if one exists. NOTE: any REST query for this message pattern will result in the current, cached copy of all responsive records being returned to the client. An example of this pattern is the  "NBBOOptionQuote" message

2. **Security Keys:**

    Several messages contain security keys (TickerKey, ExpiryKey, and/or OptionKey)

    - TickerKey: `SSSS-TS-AT` where SSSS is the security symbol (eg. AAPL), TS is a ticker source (eg. NMS), and AT is a asset type (eg. EQT).
    - ExpiryKey: `SSSS-TS-AT-YYYY-MM-DD` where YYYY is year, MM is month, and DD is day.
    - OptionKey: `SSSS-TS-AT-YYYY-MM-DD-XXXX-CP` where XXXX is the strike price, and CP is either (Call, Put, or Both).

Note that any message with an optionKey will also have a TickerKey and ExpiryKey. eg: message like OptionNbboQuote can be filtered by TickerKey to get all options for a specific ticker.

3. **Special Data Objects:** 

    - Spreads: `#SSSShhhh` where hhhh is a hexadecimal ID number. It is not possible to determine the security being traded without referring to the associated product definition.
    - FLEX: encoded as OptionKeys with the security symbol being the standard FLEX root.
    - Market Data: distributed with one of the above security keys where the symbol is the exchange trading symbol. Product definition records are available for all trading instruments that contain more complete details.
    - Synthetics: `_SSSS` or `SSSS_` computed for the purpose of pricing options more accurately (eg. multi-hedge basket underliers or roll+model derived options on futures quotes).

4. **Admin Data Objects without Primary Keys:**

    Some SR MLink objects do not have natural primary keys and are used as administrative messages between MLink and a client. An example of this pattern is "MLinkLogon". 

5. **HTTP/REST Admin Messages:**

    | Messages           | Description |
    |--------------------|---------------------------------------------------------------------------------|
    | MLinkApiKey        | Used to return a temporary ApiKey (./getapikey) |
    | QueryResult        | Futures quote/print metrics (the last message in a response.body block) (./getmsg or ./getmsgs) |
    | MsgTickerKey       | Used to return the set of active TickerKeys for a given message type (./gettkeyset) |
    | MsgExpiryKey       | Used to return the set of active ExpiryKeys for a given message type (./getekeyset) |
    | MsgOptionKey       | Used to return the set of active OptionKeys for a given message type (./getokeyset) |
    | MsgDesc            | Message Description (describes an SR message) (in response to ./getmsgtypes call) |
    | FieldDesc          | Field Description (schema) (in response to a ./getschema call) |
    | SummaryNumeric     | Summary detail for a numeric field (in response to a ./getsummary call) |
    | SummaryString      | Summary detail for a string field (in response to a ./getsummary call) |
    | PostAck            | Post acknowlegement for an individual SR message post attempt (./postmsgs) |

6. **MLink/WebSocket Admin Messages:**

    | Messages           | Description |
    |--------------------|---------------------------------------------------------------------------------|
    | MLinkAdmin         | Sent in response to a WebSocket connect attempt and also in response to an MLinkLogon message |
    | MLinkLogon         | Used to logon (authenticate) (only required if credentials were not supplied in initial HTTP connect) |
    | MLinkQuery         | Set or update the active subscription query for this session |
    | MLinkResponse      | Sent in response to an MLinkQuery |
    | MLinkSignalReady   | Used to signal that the client is ready for more messages (live subscriptions w/o an active latency) |
    | MLinkDataAck       | Sent in response to an message upload attempt|

# Authentication Methods

## 1. Machine Authentication - API Key
Use this method to authenticate your application directly to MLink if there is no ability to use MFA or you only require a single data feed. 

**Setting up an API Key:**

Request an API Key from SpiderRock support, this API Key will be associated with the requestor's SpiderRock ID (username) and scoped to the correct permissions. When setting up an API Key, there is optionally the ability to provide an API Secret that is up to 64 characters.

**Using an API Key with MLink:**
To authenticate with an API Key to MLink, use an API Key Token formatted as either "APIKey" (if no password is set) or "APIKey.APIPassword".

`eg. https://mlink.spiderrockconnect.com/rest/json?apikey=1234-5678-9012-31415.password`

## 2. Human Authentication - JSON Web Token (JWT)
Use this method to authenticate your application by allowing humans to log in with their SpiderRock credentials and access their specific accounts.

**Obtaining a valid JWT:**

Method 1: Use the SpiderRock ID screens, where the user will be challenged for their SpiderRock ID, password, and an MFA code. After a successful authentication, a JWT will be issued to the front end as well as the SpiderRock backend to authenticate the session. 

Method 2: Use the AWS Cognito API to build login interface (get `user_pool_id` from SpiderRock), provide fields to capture SpiderRock ID, password and MFA challenge. After a successful authentication, a JWT will be issued to the front end as well as the SpiderRock backend to authenticate the session. 

# Connection Types

MLink offers 2 different connection types depending on the nature of the application required. The **REST API** should be used for applications that need to query data from time to time, this connection type allows for more conservative message consumption which keeps costs lower. The **Websocket** connection should be used for applications that require a live subscription to data, this connection type flows data to the screen automatically and tends to consume more messages as a result.

## 1. MLink REST API

The MLink REST API is implemented as a standard HTTP/RESTful service accessible at:

- Real-time data - https://mlink.spiderrockconnect.com 
- Delayed data - https://mlink-delay.spiderrockconnect.com

Query parameters are URL-encoded and passed in the querystring. If successful, responses are sent back via the HTTP request body section. The URL also determines the protocol.

### Protocol Usage
- **JSON** - Standard JSON

    Query:

    `https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsg&msgtype=OptionNbboQuote&pkey=AA-NMS-EQT-2023-07-23-1-C`

    Response:

    ```json
    [
    {"header":{"mTyp":"OptionNbboQuote"},"message":{"pkey":{"okey":{"at":"EQT","ts":"NMS","tk":"AA","dt":"2023-07-23","xx":1,"cp":"Call"}},"updateType":"PrcChange","bidPrice":1.1,"askPrice":1.11,"bidSize":1,"askSize":11,"cumBidSize":201,"cumAskSize":101,"bidMask":12,"askMask":45,"bidMktType":"Rotation","askMktType":"CustInterest","bidPrice2":1.09,"askPrice2":1.12,"cumBidSize2":10,"cumAskSize2":10,"bidTime":45600,"askTime":45700,"srcTimestamp":1682362339832326900,"netTimestamp":1682362339832266300}},
    {"header":{"mTyp":"QueryResult"},"message":{"numMessagesSent":1,"queryElapsed":0.0341,"result":"Ok"}}
    ]
    ```

- **Framed JSON** - SpiderRock JSON with protobuf-like header. The framing header is a fixed length (14 bytes) and in the form: \r\nJMMMMMLLLLLL, where J is the protocol [J = framed json, P = protobuf], MMMMM is the message number (zero padded), and LLLLLL is the message length (zero padded).

    Query:

    `https://mlink.spiderrockconnect.com/rest/jsonf?apikey="your_api_key"&cmd=getmsg&msgtype=OptionNbboQuote&pkey=GLD-NMS-EQT-2023-06-23-160-C`

    Response:

    ```json
    J02745000499{"header":{"mTyp":"OptionNbboQuote"},"message":{"pkey":{"okey":{"at":"EQT","ts":"NMS","tk":"AA","dt":"2023-07-23","xx":1,"cp":"Call"}},"updateType":"PrcChange","bidPrice":1.1,"askPrice":1.11,"bidSize":1,"askSize":11,"cumBidSize":201,"cumAskSize":101,"bidMask":12,"askMask":45,"bidMktType":"Rotation","askMktType":"CustInterest","bidPrice2":1.09,"askPrice2":1.12,"cumBidSize2":10,"cumAskSize2":10,"bidTime":45600,"askTime":45700,"srcTimestamp":1682362339832326900,"netTimestamp":1682362339832266300}}
    J03320000111{"header":{"mTyp":"QueryResult"},"message":{"numMessagesSent":1,"queryElapsed":0.0009,"result":"Ok"}}

    ```

- **Protobuf** - Google's mechanism for serializing structured data, generally more efficient for processing higher bandwidth, lower-latency applications. See compilation notes below for usages. See above Framed JSON for header information.

    Query: 

    `https://mlink.spiderrockconnect.com/rest/proto?apikey="your_api_key"&cmd=getmsg&msgtype=OptionNbboQuote&pkey=AA-NMS-EQT-2023-07-23-1-C`

    Response:

    ```cmd
    P02745000499<OptionNbboQuote as protoBuf/binary message>
    P03320000111<QueryResult as protoBuf/binary message>
    ```

    **Compiling SR proto files**

    `.proto` files exist in [SRMlink/proto_files](/proto_files):
    - spiderrock_common.proto
    - All Token .proto files for SpiderRock specific messages

    Both of these files need to be compiled to use [protobuf](https://protobuf.dev/overview/) with MLink.

    - To compile, first install the compiler, [download the package](https://github.com/protocolbuffers/protobuf/releases/tag/v22.2) and follow the instructions in the README.
    - Then, run the compiler, specifying your application's source directory (the current directory is used by default), the destination directory (where you want the generated code to go), and the path to your .proto file.

    For python, using python_out:

    ```cmd
    protoc -I=$SRC_DIR --python_out=$DST_DIR $SRC_DIR/[File].proto
    ```

    In your specified destination, this will generate N .py files:
    - spiderrock_common_pb2.py 
    - "Specific message"_pb2.py

### REST Commands:

Query parameters are a set of key/value pairs (not case-sensitive):

| Name    | Parameter | Description |
|---------|-----------|----------------------------------------------------------------------------------------------------|
| cmd     | c         | c="command" - the type of command, see list below |
| msgType | mt        | mt="message type" - either the string or numeric label of an SR Data Object class|
| pkey    | pk        | pk="primary key" - a string representation of the primary key of a specific SR Data Object instance|
| tkey    | tk        | tk="ticker key" - a string representing an SR ticker key (eg. 'AAPL-NMS-EQT')|
| ekey    | ek        | ek="expiry key" - a string representation of an SR expiry key (eg. 'AAPL-NMS-EQT-2023-07-32')|
| okey    | ok        | ok="option key" - a string representation of an SR option key (eg. 'AAPL-NMS-EQT-2023-07-28-500-C') |
| limit   | l         | l="limit" - a number between 1 and 10,000 and acts to limit the number of messages in the response body |
| secret  | secret    | secret="secret" - the client-supplied API Password (if any) [only used with getapikey] |
| view    | v         | v="view clause" - a string in the form of "field1  field2  field3" |
| where   | w         | w= "where clause" - a string in the form "field1:eq:value" or "(field1:ne:value1 & field1:ne:value2) |

"WHERE" clauses can contain the following comparison symbols:
- :gt: is greater than
- :ge: is greater than or equal to
- :lt: is less than
- :le: is less than or equal to
- :eq: is equal
- :ne: is not equal
- %26 is an AND statement
- | is an OR statement
- SW is starts with
- EW is ends with
- CV is contains values
- NV is does not contain value 

#### Commands:

| Command     | Description |
|-------------|------------------------------------------------------------------|
| getapikey   | creates/updates MLink API Key |
| getmsgtypes | returns all available message types |
| getschema   | returns a single message schema |
| getlayout   | returns msgLayour and FieldLayout |
| getsummary  | returns message type summmary |
| gettkeyset  | returns all available TickerKeys for a message type |
| getekeyset  | returns all available ExpiryKeys for a message type and TickerKey |
| getokeyset  | returns all available Option Keys for a message type and ExpiryKey |
| getmsg      | returns a single message by PrimaryKey |
| getmsgs     | returns all available messages for a message type (can be coupled with okey, tkey, ekey) |
| getcount    | returns the count of records for a messagetype |
| postmsgs    | process/post all messages in the request body |

### Examples

Request API Key (first needs JWT authentication):

`https://mlink.spiderrockconnect.com/rest/json?cmd=getapikey&secret="your_secret"`

Get all messages available:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsgtypes`

Get field definitions for a message:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getschema&msgtype=OptionNbboQuote`

Filtering by an Option Key:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsgs&msgtype=OptionNbboQuote&okey=AA-NMS-EQT-2023-07-23-1-C`

Filtering by a Ticker Key:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsgs&msgtype=OptionNbboQuote&tkey=AAPL-NMS-EQT`

Filtering by a View:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsgs&msgtype=OptionNbboQuote&view=okey|bidprice|askprice`

Complex filtering:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getmsgs&msgtype=OptionNbboQuote&where=(bidsize:eq:1%26asksize:eq:1)|(bidsize:eq:10%26asksize:eq:1)&view=okey|bidprice|askprice|asksize|bidsize`

Get summary:

`https://mlink.spiderrockconnect.com/rest/json?apikey="your_api_key_token"&cmd=getsummary&msgtype=OptionNbboQuote&view=bidprice|askprice|bidsize|asksize`

## 2. Websocket API

The MLink Websocket API is implemented as a standard HTTP WebSocket service accessible at:

- Real-time data - wss://mlink.spiderrockconnect.com
- Delayed data - wss://mlink-delay.spiderrockconnect.com

Query parameters are URL-encoded and passed in the querystring. If successful, responses are sent back via the HTTP request body section. The URL also determines the protocol.

### Websocket Parameters:

| Field Name      | Field Type         | Description                                                                                                                |
|-----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------|
| queryLabel      | AppNameString      |  query label                                                                                                               |
| queryType       | enum               | None=0,FullQuery=1,IncrQuery=2,FullSubscription=3,IncrSubscription=4                                                       |
| activeLatency   | int                | milliseconds between active query refreshes (0 = no delay, -1 = wait for SignalReady) [default = -1]                       |
| sysEnvironment  | enum               | (optional) records cannot have [sysEnvironment + sysRealm] in their route history (no loops)                               |
| sysRealm        | enum               |                                                                                                                            |
| highwaterTs     | long               | (optional) records must have a header.sentTs that is later than this value (ns after the UNIX epoch)                       |
| stripeFilter    | text1              | (optional) if supplied records must be within the specified stripe                                                         |
| accntFilter     | text1              | (optional) if supplied records must have an x-ray accnt from this set [comma separated]                                    |
| clientFirmFilter| text1              | (optional) if supplied records must have an x-ray client firm from this set [comma separated]                              |
| userNameFilter  | text1              | (optional) if supplied records must have an x-ray user name from this set [comma separated]                                |
| TKeyFilters       | tickerKey          | (optional) eg "TKeyFilters":[{"tickerKey":{"at":"EQT","ts":"NMS","tk":"SPX"}}]                                                |
| EKeyFilters       | expiryKey          | (optional) eg "EKeyFilters":[{"expiryKey":{"at":"FUT","ts":"NYMEX","tk":"@CL","dt":"2023-06-16"}}]                                                                                                                          |
| OKeyFilters       | optionKey          | (optional) eg "OKeyFilters":[{"optionKey":{"at":"EQT","ts":"NMS","tk":"VIXW","dt":"2023-06-23","xx":23,"cp":"Put"}}]                                                                                                                         |
| MsgTypes         | repeating list             | (optional) if not empty records must have a msgTypes this set. All elements after are in repeating list                                                              |
| msgType         | ushort             | (optional) message code                                                               |
| msgName       | MessageTypeName            | (optional) message name                                                              |
| schemaHash      | long               | (optional) message schema hash [if supplied and matches server schema hash for this message binary encoding will be used]  |
| localMsgType    | ushort             | (optional) if != 0 the msgType number will be translated from msgType to localMsgType in the mlink server (binary messages)|
| localMsgName    | MessageTypeName    | (optional) if exists the message name will be translated from msgName to localMsgName in the mlink server (json and protobuf messages)|
| view            | string             | (optional) list (subset) of field names to return with this message (eg. bidprice,askprice,bidsize,asksize) (default is all names)|
| where           | string             | (optional) where clause for this message type; eg. "(bidexch:eq:CBOE) & bidsize:ge:100"  (default is all records)|


### Websocket Query Types:

| queryType:enum | Name               | Description                                                           |
|----------------|--------------------|-----------------------------------------------------------------------|
| 1              | FullQuery          |Return records from cache and nothing more                                                                       |
| 2              | IncrQuery          |Return records (with highwatermark > x) from cache and nothing more                                                                       |
| 3              | FullSubscription   |Return records from cache and also any future updates (per update rules)                                                                       |
| 4              | IncrSubscription   |Return records from cache (with highwatermark > x) and also any future updates (per update rules)                                                                       |

### Establishing a connection

After authenticating a websocket connection:

- The first message sent from the client to MLink
must be an "MLinkLogon" message containing either an API Key or JWT. 
- The first message sent from MLink to the client will be an "MLinkAdmin" message containing an application state [LoggedOn, WaitingForLogon, AuthError, OtherError] depending on the authentication state.

If at any time during a session, a user sends an MLinkLogon message, the server will attempt to (re-)authenticate the user and will return an MLinkAdmin message.
### Protocol Usage
- **JSON** - Standard JSON, each websocket frame can only contain one JSON message at a time.
   
    Import Classes:

    ```Python 
    import asyncio
    import json
    import time
    import websockets
    import nest_asyncio
    import threading
    import datetime
    nest_asyncio.apply()
    ```
    Authentication:

    ```Python
    uriJson = "wss://mlink.spiderrockconnect.com/mlink/json"
    apiKey = 'your api key'
    password = 'your password'
    api_key_token = f"{apiKey}.{password}"
    ```

    Asynchronously query AAPL:

    ```Python
    async def recv_msg(websocket):
      buffer = await websocket.recv()
      parts = list(filter(None, buffer.split(b'\r\n')))
        for msg in parts:
          result = json.loads(msg)
          print(result, '\n')
          message = result['message']
          notDone = message.get('state', None) != 'Complete'
    return notDone

    async def query_mlink(api_key_token):
      retry = True
      while retry:
        try:
          async with websockets.connect(
            uriJson,
            extra_headers={"Authorization": f"Bearer {api_key_token}"},
            ping_timeout=None
          ) as websocket:
            msg = {
              "header":  {"mTyp": "MLinkQuery"},
              "message": {"queryLabel": "ExampleStockNbbo",
                          "queryType": "FullQuery", #you can stream AAPL by changing the queryType to FullSubscription, see examples
                          "MsgTypes": [{"msgType":3000},{"msgName":"StockBookQuote"}], 
                          "TKeyFilters":[{"tickerKey":{"at":"EQT","ts":"NMS","tk":"AAPL"}}]
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
    ```

- **Framed JSON** - SpiderRock JSON with protobuf-like header. 

    Same as JSON above, except for the parser:

    ```Python
    async def query_mlink(api_key_token):
      retry = True
      while retry:
        try:
          async with websockets.connect(
            uriJson, 
            extra_headers={"Authorization": f"Bearer {api_key_token}"},
            ping_timeout=None
          ) as websocket:
            msg = {
              "header":  {"mTyp": "MLinkQuery"},
              "message": {"queryLabel": "ExampleStockNbbo",
                          "queryType": "FullQuery",
                          "MsgTypes": [{"msgType":3000},{"msgName":"StockBookQuote"}], 
                          "TKeyFilters":[{"tickerKey":{"at":"EQT","ts":"NMS","tk":"AAPL"}}]
                         }
            }
            t = time.time_ns()
            tstr = '.'.join([time.strftime("%Y-%m-%d %H:%M:%S",time.gmtime(t/1000000000)),"%06d"%((t/1000)%1000000)])
            msg['header']['sTim'] = tstr
            msg['header']['encT'] = tstr
            smsg = json.dumps(msg)
            jmsg = ''.join(['\r\nJ', '%011d'%len(smsg), smsg]) #header
            await websocket.send(jmsg)
            notDone = True
            while notDone:
              buffer = await websocket.recv()
              parts = list(filter(None,buffer.split(b'\r\n')))
              for msg in parts:
                result = json.loads(msg[12:])
                print(result, '\n')
                message = result['message']
                notDone = message.get('state',None) != 'Complete'
              retry = False
            except asyncio.exceptions.TimeoutError:
              print("timeout occurred, retrying...")
    ```
- **Protobuf** - Google's mechanism for serializing structured data, generally more efficient for processing higher bandwidth, lower-latency applications.

    Import Classes:

    ```Python 
    import asyncio
    import json
    import time
    import websockets
    import nest_asyncio
    import threading
    import datetime
    nest_asyncio.apply()
    ```
    Authentication:

    ```Python
    uriProto = "wss://mlink.spiderrockconnect.com/mlink/proto"
    apiKey = 'your api key'
    password = 'your password'
    api_key_token = f"{apiKey}.{password}"
    ```

    Asynchronously query AAPL:

    ```Python
    async def query_mlink(api_key_token):
      retry = True
      while retry:
        try:
          async with websockets.connect(
            uriProto,
            extra_headers={"Authorization": f"Bearer {api_key_token}"},
            ping_timeout=None
          ) as websocket:
            # Create the protobuf message
            mlink_query = sr_messages.MLinkQuery()
            mlink_query.query_label = "Example1"
            mlink_query.query_type = sr_common.MLINKQUERYTYPE_FULL_QUERY
            mlink_query.descriptor.message_type = "MLinkQuery"
            msg_type = mlink_query.msg_type.add()
            msg_type.msg_type = 3000
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
              if messageTypeNumber == 3385:
                result = sr_messages.MLinkResponse()
              elif messageTypeNumber == 3000:
                result = sr_messages.StockBookQuote()
              result.ParseFromString(msg[12:])
              print(result, '\n')
              notDone = messageTypeNumber != 3315 or result.state != sr_common.MLINKSTATE_COMPLETE
              retry = False
            except asyncio.exceptions.TimeoutError:
              print("timeout occurred, retrying...")


### Websocket Active Latency

MLinkQuery contains an ActiveLantency field that governs subsequent updates after the initial (cache) query.  If this field is set to -1 then the user is required to send a SignalReady message which will trigger the MLinkServer to send an update (if any) to all response messages.

Note:
- It is possible for the MLinkServer to have received multiple updates to a single Primary Key between successive SignalReady messages. If this occurs, only the most recent record update will be forwarded to the client.
- If activelyLatency is set to any integer N greater than or equal to zero it will have the effect of automatically triggering the transmission of any pending updates every N milliseconds with zero being interpreted as no delay.
- If the client system is unable to process messages at the speed with which they are being sent, MLinkServer will fall back to sending messsages at the rate the client is able to receive, which will also result is some messages being skipped in favor of more recent updates.  







