import React, {useState} from 'react';
import readXlsxFile from 'read-excel-file'

// import './TestComponent.css'

const TestComponent = (props) => {
    const [fileSelected, setFileSelected] = useState(false);
    // массив данных таблицы, спроецированных на объекты
    const [rowData, setRowData] = useState([]);
    // массив объектов, подготовленных к отправке(готовые документы)
    const [sendData, setSendData] = useState([]);
    // массив названий колонок
    const [columnNames, setColumnNames] = useState([]);
    // название колонки с лицевым счетом
    const [billColumnName, setBillColumnName] = useState('');
    // название колонки с датой создания
    const [dateColumnName, setDateColumnName] = useState('');
    // название колонки с суммой оплаты
    const [payColumnName, setPayColumnName] = useState(0);
    // флаг неверно указанного имени колонки с лицевым счетом
    const [wrongBillColumnName, setWrongBillColumnName] = useState(false);
    // флаг неверно указанного имени колонки с датой создания
    const [wrongDateColumnName, setWrongDateColumnName] = useState(false);
    // флаг неверно указанного имени колонки с суммой оплаты
    const [wrongPayColumnName, setWrongPayColumnName] = useState(false);
    // ставка ндс
    const [rate, setRate] = useState(0);
    // номер телефона по-умолчанию
    const [phoneNumber, setPhoneNumber] = useState('');
    // почта по-умолчанию
    const [email, setEmail] = useState('');

    const onFileLoaded = (e) => {
        if (e.target.files && e.target.files.length) {
            let f = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                let data = new Uint8Array(e.target.result);
                readXlsxFile(data).then((rows) => {
                    if (rows && rows.length) {
                        const selectedRows = [];
                        let columnNamesRow = [];
                        rows.forEach((row, index, array) => {
                            if (index === 1) {
                                columnNamesRow = row;
                            }
                            if (index > 1 && index !== array.length - 1) {
                                selectedRows.push(row);
                            }

                        });
                        const convertedRows = selectedRows.map((row) => {
                            return convertRowToObject(row, columnNamesRow);
                        });
                        setColumnNames(columnNamesRow);
                        setRowData(convertedRows);
                        setFileSelected(true);
                    }
                });
            };
            reader.readAsArrayBuffer(f);
        } else {
            // todo: show message
        }
    };
    const convertRowToObject = (rowData, columnNames) => {
        const resultObject = {};
        columnNames.forEach((columnName, index) => {
            resultObject[columnName] = rowData[index];
        });
        return resultObject;
    };
    const generateReceiptId = (rowObject) => {
        function getRandomChar() {
            const possible = "abcdefghijklmnopqrstuvwxyz";
            return possible.charAt(Math.floor(Math.random() * possible.length));
        }

        let bill = rowObject[billColumnName];
        let pay = rowObject[payColumnName].replace(/[,]/g, '');
        let date = rowObject[dateColumnName].replace(/[.]/g, '');
        let result = `${date}-${bill.substr(0, 4)}-${bill.substr(4, 4)}-${bill.substr(-4)}-${pay}`;
        if (result.length > 36) {
            result = result.substr(0, 36);
        }
        if (result.length < 36) {
            while (result.length < 36) {
                result = result + getRandomChar();
            }
        }
        return result;
    };
    const generateReceiptCode = () => {
        return '5555-000111';
    };
    const prepareSendData = () => {
        const _sendData = rowData.map((row) => {
            const id = generateReceiptId(row);
            const code = generateReceiptCode();
            const paymentSum = +row[payColumnName].replace(/[,]/g, '.');
            return {
                id: id,
                code: code,
                documentType: 'Счет',
                dt: row[dateColumnName],
                products: [{
                    uuid: 'c3bf1536-17e6-4cfb-a47e-7e6c0ad0b851',
                    name: 'Платеж через банк за услуги ЖКХ',
                    measureName: 'шт',
                    measurePrecision: 3,
                    price: paymentSum,
                    rate: rate,
                    count: 1,
                }],
                paymentType: 'electron',
                paymentSum: paymentSum,
                buyerInfo: {},
            };
        });
        setSendData(_sendData);
    };
    const selectBillColumnName = (name) => {
        const billValue = rowData[0][name];
        if (Number.parseInt(billValue) && billValue.length >= 9) {
            setBillColumnName(name);
            setWrongBillColumnName(false);
        } else {
            setWrongBillColumnName(true);
        }
    };
    const selectPayColumnName = (name) => {
        const payValue = rowData[0][name];
        if (Number.parseFloat(payValue)) {
            setPayColumnName(name);
            setWrongPayColumnName(false);
        } else {
            setWrongPayColumnName(true);
        }
    };
    const selectDateColumnName = (name) => {
        const dateValue = rowData[0][name];
        if (Date.parse(dateValue) && dateValue.split('.').length === 3) {
            setDateColumnName(name);
            setWrongDateColumnName(false);
        } else {
            setWrongDateColumnName(true);
        }
    };
    const selectPhoneColumnName = (name) => {

    };
    const selectMailColumnName = (name) => {

    };
    const onPhoneNumberInputChange = (event) => {
        setPhoneNumber(event.target.value);
    };
    const onEmailInputChange = (event) => {
        setEmail(event.target.value);
    };
    // Функции валидации
    const isPhoneNumberValid = () => {
       return phoneNumber && phoneNumber.search(/^(\+7|8)\d{10}$/g) !== -1;
    };
    const isEmailValid = () => {
       return email && email.search(/[A-Za-z0-9_]@{1}[A-Za-z0-9_]+\.[A-Za-z0-9_]+/gi) !== -1;
    };
    const canCreateDocuments = () => {
        return !isEmailValid() || !isPhoneNumberValid() || ;
    };

    return (
        <div className='TestComponent'>
            {!fileSelected
                ? <input type="file" onChange={onFileLoaded}/>
                : columnNames && columnNames.length
                    ? <React.Fragment>
                        <span>Выберите колонку с лицевым счетом</span><br/>
                        <select
                            name="bill"
                            onChange={(e) => selectBillColumnName(e.target.value)}
                        >
                            <option></option>
                            {columnNames.map((row) => {
                                return <option key={`bill-${row}`} value={row}>{row}</option>
                            })}
                        </select>
                        {wrongBillColumnName ? <span>Выбрана неверная колонка</span> : null}
                        <br/>
                        <br/>
                        <span>Выберите колонку с суммой платежа</span><br/>
                        <select
                            name="pay"
                            onChange={(e) => selectPayColumnName(e.target.value)}
                        >
                            <option></option>
                            {columnNames.map((row) => {
                                return <option key={`pay-${row}`} value={row}>{row}</option>
                            })}
                        </select>
                        {wrongPayColumnName ? <span>Выбрана неверная колонка</span> : null}
                        <br/>
                        <br/>
                        <span>Выберите колонку с датой платежа</span><br/>
                        <select
                            name="date"
                            onChange={(e) => selectDateColumnName(e.target.value)}
                        >
                            <option></option>
                            {columnNames.map((row) => {
                                return <option key={`date-${row}`} value={row}>{row}</option>
                            })}
                        </select>
                        {wrongDateColumnName ? <span>Выбрана неверная колонка</span> : null}
                        <br/>
                        <br/>
                        <span>Выберите колонку, содержащую номер телефона (необязательно)</span><br/>
                        <select
                            name="phone"
                            onChange={(e) => selectPhoneColumnName(e.target.value)}
                        >
                            <option></option>
                            {columnNames.map((row) => {
                                return <option key={`phone-${row}`} value={row}>{row}</option>
                            })}
                        </select>
                        <br/>
                        <br/>
                        <span>Выберите колонку, содержащую почтовый ящик (необязательно)</span><br/>
                        <select
                            name="mail"
                            onChange={(e) => selectMailColumnName(e.target.value)}
                        >
                            <option></option>
                            {columnNames.map((row) => {
                                return <option key={`mail-${row}`} value={row}>{row}</option>
                            })}
                        </select>
                        <br/>
                        <br/>
                        <span>Введите ставку НДС</span>
                        <select name="nds" onChange={(e) => setRate(e.target.value)}>
                            {[0, 10, 18, 20, 110, 118].map((rate) => {
                                return <option key={rate} value={rate}>{rate} %</option>
                            })}
                        </select>
                        <br/>
                        <br/>
                        <p>Пожалуйста, заполните следующие поля. Их значения будут использованы в случае отсутствия в записи номера телефона и почтового ящика</p>
                        <br/>
                        <br/>
                        <input type="text"
                               placeholder='Введите номер телефона'
                               value={phoneNumber}
                               onChange={onPhoneNumberInputChange}/>
                        {!isPhoneNumberValid() ? <span>Поле не заполнено, либо не соответствует одному из шаблонов(8xxxxxxxxxx, +7xxxxxxxxxx)</span> : null}
                        <br/>
                        <br/>
                        <input type="text"
                               placeholder='Введите email'
                               value={email}
                               onChange={onEmailInputChange}/>
                        {!isEmailValid() ? <span>Поле не заполнено, либо заполнено некорректно</span> : null}
                        <br/>
                        <br/>
                        <button onClick={prepareSendData} disabled={canCreateDocuments()}>Create entities</button>
                        <br/>
                        <br/>
                        <pre>{sendData.length ? JSON.stringify(sendData, null, 2) : null}</pre>
                    </React.Fragment>
                    : <span>Ошибка при обработке загруженного файла. Не найдено ни одной записи.</span>
            }
        </div>
    );
};

export default TestComponent;