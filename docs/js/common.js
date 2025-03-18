var inputPin = document.getElementById('pin');
var inputPin2 = document.getElementById('pin2');
var inputDescr = document.getElementById('descr');
var inputCsr = document.getElementById('csr');
var inputLastName = document.getElementById('lastName');
var inputFirstName = document.getElementById('firstName');
var inputInn = document.getElementById('inn');
var cert;
var inputFile = document.getElementById('certFile');
var inputCertInfo = document.getElementById('certInfo');
var inputCertId = document.getElementById('certId');
var inputCertId2 = document.getElementById('certId2');
var inputData = document.getElementById('data');
var inputAttached = document.getElementById('attached');
var inputData2 = document.getElementById('data2');
var inputSign = document.getElementById('sign');
var inputEncrypted = document.getElementById('encrypted');
var inputDecrypted = document.getElementById('decrypted');
var formCsr = document.getElementById('formCsr');
var formCert = document.getElementById('formCert');
var formSign = document.getElementById('formSign');
var formEncrypt = document.getElementById('formEncrypt');
var buttonRefresh = document.getElementById('refresh');
var inputAllInfo =  document.getElementById('allinfo');

buttonRefresh.addEventListener('click', e => {
    e.preventDefault();
    loadCerts();
});

inputCertId.addEventListener('change', e => {
    const contId = e.target.value;
    inputCertInfo.value = '';
    if(!contId) return;
    showInfo(contId);
});

formCsr.addEventListener('submit', e => {
    e.preventDefault();
    requestCSR();
});

formCert.addEventListener('submit', e => {
    e.preventDefault();
    requestCertificate();
});

formSign.addEventListener('submit', e => {
    e.preventDefault();
    signData();
});

function pasteFile(event) {
    const file = event.target.files.item(0)
    file.text().then(
        (text) => {
            cert = text.replace('-----BEGIN CERTIFICATE-----', '')
                .replace('-----END CERTIFICATE-----', '');
        }
    )
}

formEncrypt.addEventListener('submit', e => {
    e.preventDefault();
    encryptData();
});

function setCertOptions(certs) {
    inputCertId.innerHTML = '';
    inputCertId2.innerHTML = '';
    var options = [];
    var placeholder = document.createElement('option');
    placeholder.selected = true;
    placeholder.disabled = true;
    placeholder.text = 'Выберите сертификат';
    placeholder.value = '';
    options.push(placeholder);

    for(var i in certs) {
        var option = document.createElement('option');
        option.value = certs[i].id;
        option.text = certs[i].name;
        options.push(option);
    }
    for(var i in options) {
        inputCertId.appendChild(options[i]);
    }
    inputCertId2.innerHTML = inputCertId.innerHTML;
}
