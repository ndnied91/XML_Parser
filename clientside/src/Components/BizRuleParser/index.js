import React from 'react'

// import './style.css'
class BizRuleParser extends React.Component{
  constructor(props) {
     super(props);
     this.state = { data: [] , searchTerm: '' , selection: ''};
     this.onInputchange = this.onInputchange.bind(this);
     this.handleChange = this.handleChange.bind(this);
   }

   handleChange(e){ this.setState({selection:e.target.value}); }

  onInputchange(event) {
    this.setState({searchTerm: event.target.value}, () => {
        console.log(this.state);
    });
}



  render(){

      const getRules = (xml) => {
        const names = xml.getElementsByTagName("business-rule");
        let numberofBrs = names.length
        let undefinedCount = 0
        // let keyWord = 'c2c-spec-id'
        // let keyWord = 'show-c2chat'
        // let keyWord = 'show-c2chat'
        // let keyWord = 'c2c-theme-id'








        for (let i = 0; i < names.length; i++) {
          let name = names[i];
          let searchTerm = name.getElementsByTagName(this.state.searchTerm)[0]

            console.log(name.getAttributeNode('name'))

          if(searchTerm !== undefined){
            console.log(searchTerm)
            // console.log(searchTerm.getElementsByTagName('number')[0])
            // console.log(name.getAttributeNode('name'))
            // console.log(searchTerm.getAttributeNode('number'))
            // getAttribute
          }
          else{
            undefinedCount++
            console.log('not set')
          }


        }
        console.log('number of business-rules is' , numberofBrs)
        console.log(`number of brs not using overriding ${this.state.searchTerm} is ${undefinedCount}` )
        console.log(`number of brs using default c2c specs is ${undefinedCount}` )
        console.log(`number of brs overriding c2c spec is  ${(numberofBrs - undefinedCount)}` )

      };

      const getResponseXML = async () => {
        // get XML
        // retrieve XML
        const xml = await fetch("ups1.xml");
        const parsedXML = await xml.text();
        getRules(new window.DOMParser().parseFromString(parsedXML, "text/xml"));
      };



    return <div className="mainheader">
        <h1> Parser For Biz Rules</h1>

        <div>
            <input  name="searchTerm" placeholder="enter xml tag" type="text" value={this.state.searchTerm} onChange={this.onInputchange} required />
        </div>

        <button onClick={()=>getResponseXML()}> Search </button>

    </div>
  }
}


export default BizRuleParser

// https://stackoverflow.com/questions/27116085/javascript-search-xml-by-tag-and-get-the-sibling-nodes
