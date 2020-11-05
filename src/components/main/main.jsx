import React, {Component} from 'react';
import XLSX from 'xlsx';
// import {make_cols} from './MakeColumns.jsx';
import {SheetJSFT} from './types.jsx';
import CsvDownload from 'react-json-to-csv'
class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: []
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renameKey = this.renameKey.bind(this);
    this.renameKeys= this.renameKeys.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      console.log(data);
    const newKeys ={[`Client Name`]: `OrderS`, Origin: `OriginS` }; ;
    let newData=  data.map((el)=> this.renameKeys(el, newKeys))
      /* Update state */
      this.setState({ data: newData }, () => {
        console.log(this.state.data);
      });

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  }
  renameKey (object, key, newKey) {
    const clone = (obj) => Object.assign({}, obj);
    const clonedObj = clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  };


  renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }
  render() {
    return (
      <div>
        <label htmlFor="file">Upload an excel to Process Triggers</label>
        <br />
        <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
        <br />

        <input type='submit'
               value="Process Triggers"
               onClick={this.handleFile} />
               <h1>Dounload SCV</h1>
        <CsvDownload data={this.state.data}/>
      </div>

    )
  }
}

export default ExcelReader;
