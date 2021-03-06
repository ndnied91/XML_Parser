import React from 'react'

import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';



class BizRuleParser extends React.Component{
  constructor(props) {
     super(props);
     this.state = { data: [] , searchTerm: 'c2c-theme-id' , numberOfBrs : 0 , undefinedCount: 0 };
     this.onInputchange = this.onInputchange.bind(this);
     this.variances = new Map()
     this.testVarible= "this is a test";
   }

  onInputchange(event) {
    this.setState({searchTerm: event.target.value }, () => {
        this.setState({data: [], numberOfBrs:0 })
        console.log(this.state);
    });

}




  render(){
      let data = []




      const getRules = (xml) => {
        const names = xml.getElementsByTagName("business-rule");
        let numberOfBrs = names.length
        let undefinedCount = 0
        // let keyWord = 'c2c-spec-id'
        // let keyWord = 'show-c2chat'
        // let keyWord = 'show-c2chat'
        // let keyWord = 'c2c-theme-id'


            for (let i = 0; i < names.length; i++) {
              let name = names[i];
              let searchTerm = name.getElementsByTagName(this.state.searchTerm)[0]
              let condition = ''
              let obj = {}
              let brName = name.getAttributeNode('name').value

              if(searchTerm !== undefined){
                if(searchTerm.children[0].attributes.length >0){
                  condition = searchTerm.children[0].attributes[0].nodeValue
                }
                else{
                  condition = searchTerm.children[0].textContent
                }

                if(!this.variances.has( condition )){ this.variances.set(  condition , 1); }
                  else{ this.variances.set(  condition , this.variances.get(  condition )+1); }

                  obj = {brName , condition}


              }
              else{
                undefinedCount++
                name = name.getAttributeNode('name').value
                condition = 'DEFAULT'

                if(!this.variances.has( condition )){ this.variances.set(  condition , 1); }
                  else{  this.variances.set(  condition , this.variances.get(  condition )+1); }

                obj = {brName , condition}
              }

              data.push(obj)

            }

        this.setState({numberOfBrs , undefinedCount})
        this.setState({data: data.sort((a, b) => (a.condition > b.condition) ? 1 : -1)})
      };





      const getResponseXML = async (e) => {
        e.preventDefault()
        const xml = await fetch("file.xml");
        const parsedXML = await xml.text();
        getRules(new window.DOMParser().parseFromString(parsedXML, "text/xml"));
      };



  let str = ''
  const renderData = () =>{
    return this.state.data.map((i , index)=>{
        str = str + i.brName
        str = str + " : "
        str = str+ i.condition
        str = str + '\n'

      return(
            <div key={index} style={{ margin: '10px'}}>
                <span className="names">
                      {i.condition === 'DEFAULT' ? <span style={{color: "red"}}> {i.brName} </span> : <span> {i.brName}  </span> }
                </span>

                <span className="conditions">
                      {i.condition === 'DEFAULT' ? <span style={{color: "red"}}>  {i.condition} </span> : <span> {i.condition} </span> }
                </span>
           </div>
      )
    })
  }




const downloadTxtFile = () => {
  const element = document.createElement("a");
  const file = new Blob([str],{type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download =  ".txt";
  element.download =  `${this.state.searchTerm}.txt`;
  document.body.appendChild(element);
  element.click();
}


const renderVariances = ()=>{
    if(this.variances.size > 0){

      return [...this.variances].map((i, idx)=>{
        return(
              <div className="ind_res" key={idx}> <span>{i[0]} : {i[1]} </span> </div>
        )
      })


    }


}

const renderReport = ()=>{
return(
  <div className="top_info">
    <div> Number of Business Rules in XML File : <strong>{this.state.numberOfBrs} </strong> </div>
      <div> Number of BR's not overriding <strong> {this.state.searchTerm} </strong> : <strong> {this.state.undefinedCount} </strong></div>
      <div> Number of brs overriding  <strong>{this.state.searchTerm}</strong> : <strong>{(this.state.numberOfBrs - this.state.undefinedCount)}</strong> </div>



      <div className="var_results">
            <p> Number of <strong>{this.state.searchTerm}</strong>'s being used </p>
            <div className="results"> {renderVariances()} </div>
      </div>



      <div> <button className="btn btn-outline-danger" onClick={downloadTxtFile}>Download</button> </div>




  </div>
)
}


    return(
      <div className="mainheader">
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <form className="d-flex">
                    <input className="form-control me-2 widthChange" name="searchTerm" placeholder="Enter XML Tag" type="text" value={this.state.searchTerm} onChange={this.onInputchange} required />
                <button className="btn btn-outline-dark" onClick={(e)=>getResponseXML(e)}> Search </button>
              </form>
            </div>
          </nav>

              {this.state.numberOfBrs > 0 ? renderReport() : null}



              <div id="entireList">

              {this.state.numberOfBrs > 0 ?  <div className="titles"> <span> Business Rules</span> <span> {this.state.searchTerm}</span></div> : null }


                {renderData()}
                </div>

    </div>
    )
  }
}

export default BizRuleParser
