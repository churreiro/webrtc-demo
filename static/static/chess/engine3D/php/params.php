<div id="params3D" class="params3D">
    <div class='closeCross' onclick="lib_dom.hide('params3D')"></div>
    <h2>Eclairage :</h2>
    <label>Mois :</label><br/>
    <a class="month" onclick="SKYDOMEOBJ.set_month(1, this)" href="#">JAN</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(2, this)" href="#">FEV</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(3, this)" href="#">MAR</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(4, this)" href="#">AVR</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(5, this)" href="#">MAI</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(6, this)" href="#">JUN</a>
    <a class="month monthSelected" id="sun_month0" onclick="SKYDOMEOBJ.set_month(7, this)" href="#">JUL</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(8, this)" href="#">AOU</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(9, this)" href="#">SEP</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(10, this)" href="#">OCT</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(11, this)" href="#">NOV</a>
    <a class="month" onclick="SKYDOMEOBJ.set_month(12, this)" href="#">DEC</a>
    <br/>

    <label>Heure :</label>
    <select id="sun_hour" onchange="SKYDOMEOBJ.set_hour()">
        <option value="8">08:00</option>
        <option value="9">09:00</option>
        <option value="10" selected>10:00</option>
        <option value="11">11:00</option>
        <option value="12">12:00</option>
        <option value="13">13:00</option>
        <option value="14">14:00</option>
        <option value="15">15:00</option>
        <option value="16">16:00</option>
        <option value="17">17:00</option>
        <option value="18">18:00</option>
        <option value="19">19:00</option>
        <option value="20">20:00</option>
    </select><br/>

    <label>Latitude : </label>
    <select id="sun_latitude" onchange="SKYDOMEOBJ.set_latitude()">
        <option value="42">41° - France sud</option>
        <option value="46" selected>46° - France centre</option>
        <option value="51">51° - France nord</option>
    </select>
</div>