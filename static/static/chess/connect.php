        <div class="connectWin" id="connectWin">
            <div class="beforeConnect" id="beforeConnect">
                <button id="connect" class="white" onclick="WEBRTC.connect();">Connect</button>
                <div class="line">
                    <label>Server :</label><input type="text" id="server" value="http://192.168.1.32:8888" style="padding-bottom: 4px"/>
                </div>
                <div class="line">
                      <label>Name:</label><input type="text" id="name" size="30" value="name"/>
                </div>
            </div>
            <div class="afterConnect" id="afterConnect">
               <label>Available players :</label>
               <select id="peers" size="5" disabled="true">
                 <option value="-1">Not connected</option>
               </select><button id="call" onclick="WEBRTC.doCallCheck();" disabled="true" style="height: 88px;">P L A Y</button>
            </div>
        </div>