function showInfo(thumbprint) {
    var cryptopro = new window.RusCryptoJS.CryptoPro;
    return cryptopro.init().then(info => {
        console.log('Initialized', info);
        return cryptopro.certificateInfo(thumbprint);
    }).then(info => {
        console.log('CertInfo', info);
        inputCertInfo.value = info;
    }).catch(e => {
        alert('Failed! ' + e);
    });
}

function loadCerts() {
    inputCertId.innerHTML = inputCertInfo.value = '';
    
    var cryptopro = new window.RusCryptoJS.CryptoPro;
    return cryptopro.init().then(info => {
        console.log('Initialized', info);
        return cryptopro.listCertificates();
    }).then(certs => {
        console.log('Certs', certs);
        return setCertOptions(certs);
    }).catch(e => {
        alert('Failed! ' + e);
    });
}

var GlobalCryptoPro;

function requestCSR() {
    var lastName = inputLastName.value;
    var firstName = inputFirstName.value;
    try {
        var oDn = {
            'CN': lastName + ' ' + firstName,
            '2.5.4.4': lastName,
            '2.5.4.42': firstName,
            '2.5.4.12': 'сотрудник',
            '2.5.4.9': 'ул Верейская, д. 29, стр. 34',
            '2.5.4.11': 'Отдел',
            'O': 'ООО "СЕЛСАП"',
            '2.5.4.7': 'г. Москва', //L localityName нас пункт
            '2.5.4.8': '77 г. Москва', //S tateOrProvinceName регион
            'C': 'RU',
            '1.2.840.113549.1.9.1': 'info@selsup.ru',
            '1.2.643.3.131.1.1': inputInn.value, //'NUMERICSTRING:000000000076', //ИНН
            '1.2.643.100.1': '1227700169180', // 'NUMERICSTRING:0000000000024', // ОГРН
            '1.2.643.100.3': '00000000052', // 'NUMERICSTRING:00000000052' // СНИЛС
            '1.2.643.100.4': '9731090493'
        };
    }
    catch(e) {
        console.log('Parse DN', e);
        alert(e.message || e);
    }
    var dn = Object.assign(new window.RusCryptoJS.DN, oDn);
    GlobalCryptoPro = new window.RusCryptoJS.CryptoPro;
    return GlobalCryptoPro.init().then(info => {
        console.log('Initialized', info);
        return GlobalCryptoPro.generateCSR(dn, [], { pin: '' });
    }).then(result => {
        console.log('generateCSR', result);

        const csr = result.csr;
        inputCsr.value = csr;
        alert('Выпустите сертификат в УЦ на основе созданного CSR');
        inputCsr.focus();
    }).catch(e => {
        alert('Failed! ' + e);
    });
};

function requestCertificate() {
    if(!GlobalCryptoPro || !cert) {
        alert('Выберите файл сертификата');
        return false;
    }    
    return GlobalCryptoPro
    .writeCertificate(cert)
    .then(thumbprint => {
        console.log('writeCertificate', thumbprint);
        return GlobalCryptoPro.certificateInfo(thumbprint);
    }).then(info => {
        console.log('Certificate info', info);
        alert('Success!');
        GlobalCryptoPro = undefined;
        return loadCerts();
    }).catch(e => {
        alert('Failed! ' + e);
    });
}

function signData() {
    inputSign.value = '';
    var cryptopro = new window.RusCryptoJS.CryptoPro;
    var data = btoa(inputData.value);
    var attached = inputAttached.checked;
    var thumbprint = inputCertId.value;
    return cryptopro.init().then(info => {
        console.log('Initialized', info);
        return cryptopro.signData(data, thumbprint, { attached });
    }).then(sign => {
        inputSign.value = sign;
        return cryptopro.verifySign(data, sign, { attached }).catch(e => {
            console.warn(e);
            return false;
        });
    })
    .then(verified => {
        console.log('Verified: ', verified);
        alert('Success!');
    }).catch(e => {
        alert('Failed! ' + e);
    });
}

function encryptData() {
    inputEncrypted.value = inputDecrypted.value = '';
    var cryptopro = new window.RusCryptoJS.CryptoPro;
    var data = btoa(inputData2.value);
    var thumbprint = inputCertId2.value;
    return cryptopro.init().then(info => {
        console.log('Initialized', info);
        return cryptopro.encryptData(data, thumbprint);
    }).then(encrypted => {
        inputEncrypted.value = encrypted;
        return cryptopro.decryptData(encrypted, thumbprint, inputPin2.value);
    }).then(decrypted => {
        inputDecrypted.value = atob(decrypted);
        alert('Success!');
    }).catch(e => {
        alert('Failed! ' + e);
    });
}
