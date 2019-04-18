import React, {useState} from 'react';
import readXlsxFile from 'read-excel-file'

// import './TestComponent.css'

const TestComponent = (props) => {
    const [fileSelected, setFileSelected] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [columnNames, setColumnNames] = useState([]);

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

    return (
        <div className='TestComponent'>
            {!fileSelected
                ? <input type="file" onChange={onFileLoaded}/>
                :
                <React.Fragment>
                    <span>Выберите колонку с лицевым счетом</span>
                    <select name="bill">
                        <option> </option>
                        {columnNames.map((row) => {
                            return <option key={`bill-${row}`}>{row}</option>
                        })}
                    </select>
                    <br/>
                    <br/>
                    <span>Выберите колонку с датой платежа</span>
                    <select name="date">
                        {columnNames.map((row) => {
                            return <option key={`date-${row}`}>{row}</option>
                        })}
                    </select>
                    <br/>
                    <br/>
                    <span>Выберите колонку с суммой платежа</span>
                    <select name="pay">
                        {columnNames.map((row) => {
                            return <option key={`pay-${row}`}>{row}</option>
                        })}
                    </select>


                    {/*<span>Column names</span>*/}
                    {/*<pre>{rowData.length ? JSON.stringify(columnNames, null, 2) : null}</pre>*/}
                    {/*<br/>*/}
                    {/*<br/>*/}
                    {/*<span>Values</span>*/}
                    {/*<pre>{rowData.length ? JSON.stringify(rowData, null, 2) : null}</pre>*/}
                </React.Fragment>
            }
        </div>
    );
};

export default TestComponent;