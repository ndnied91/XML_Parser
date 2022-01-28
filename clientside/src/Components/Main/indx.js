import React from 'react'

class Main extends React.Component{

constructor(props) {
   super(props);
   this.state = { data: [] , searchTerm: 'send-data-to-agent' , selection: 'Utags'};
   this.onInputchange = this.onInputchange.bind(this);
   this.handleChange = this.handleChange.bind(this);
 }

 handleChange(e){ this.setState({selection:e.target.value}); }

onInputchange(event) {
  this.setState({searchTerm: event.target.value}, () => {
      console.log(this.state);
  });

}

async getResponseXML(url) {

  await this.setState({ data : []})

  const xml = await fetch(url);
  const parsedXML = await xml.text();
  this.getData(new window.DOMParser().parseFromString(parsedXML, "text/xml"));

};

books(xml){
  const names = xml.getElementsByTagName(this.state.searchTerm);
  // const names = xml.querySelectorAll(this.state.searchTerm);
    for (let i = 0; i < names.length; i++) {
      let name = names[i].firstChild.nodeValue; //for send-data-to-agent
        var doc = new DOMParser().parseFromString(names[i].innerHTML, "text/xml");
        this.setState({ data: [...this.state.data, doc.getElementsByTagName('string-variable-ref')[0].outerHTML] })
    }
}


utags(xml){

  let count =0
  let path = "//js-string-ref[@js-var-id]" //WORKS FOR JS-STRINGS-REF (UTAGS)

  if (xml.evaluate) {
      let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      console.log(nodes)

      let result = nodes.iterateNext();

      while (result) {
        count++

        let utag = result.parentNode.children[0].attributes[0].nodeValue

        this.setState({ data: [...this.state.data,utag] })
        result = nodes.iterateNext();
      }
      console.log(count)
    }
}




automaton(xml){

  let count =0

   // let path = "//map-set/map-variable-ref //NOT AS EXACT
  let path = "//map-set/map-variable-ref[@var-id='automatonDatapass']" // WORKS FOR AUTOMATOR DATA REFS

  if (xml.evaluate) {
      let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      console.log(nodes)

      let result = nodes.iterateNext();

      while (result) {
        count++

        let data = result.parentNode.getElementsByTagName('key')[0].getElementsByTagName('string')[0].innerHTML

        this.setState({ data: [...this.state.data,data] })
        result = nodes.iterateNext();
      }
      console.log(count)
    }
}




sendDataToAgent(xml){

  let count =0

  let path = "//send-data-to-agent/*/*/*" //WORKS FOR TAGS
                //title[@lang]

  if (xml.evaluate) {
      let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      // console.log(nodes)

      let result = nodes.iterateNext();

      while (result) {
        count++

        // let data = result.parentNode.getElementsByTagName('key')[0].getElementsByTagName('string')[0].innerHTML

         console.log(result.attributes[0].nodeValue)

         let attribute =  result.attributes[0].nodeValue

        this.setState({ data: [...this.state.data, attribute ] })
        result = nodes.iterateNext();
      }
      console.log(count)
    }
}





getData(xml){

  switch(this.state.selection) {
    case 'Utags':
        this.utags(xml)
      break;
    case 'Automaton':
       this.automaton(xml)
      break;
      case 'Send-Data-to-agent':
         this.sendDataToAgent(xml)
        break;
    default:
      // code block
  }


  // this.books(xml)
    // this.utags(xml)
    // this.automaton(xml)


// this.sendDataToAgent(xml)


      // // let path = "//send-data-to-agent" //WORKS FOR TAGS
      //
      //   // let path = "//map-set/map-variable-ref //NOT AS EXACT
      //
      //   // let path = "//map-set/map-variable-ref[@var-id='automatonDatapass']" // WORKS FOR AUTOMATOR DATA REFS
      //
      // if (xml.evaluate) {
      //     let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      //     console.log(nodes)
      //
      //     let result = nodes.iterateNext();
      //
      //     while (result) {
      //       count++
      //
      //
      //
      //       let utag = result.parentNode.children[0].attributes[0].nodeValue
      //       // console.log(result.parentNode.children.innerHTML)
      //
      //       // console.log(result.parentNode.getElementsByTagName('key')[0].getElementsByTagName('string')[0].innerHTML)
      //
      //
      //       // let doc = new DOMParser().parseFromString(result.parentNode, "text/xml");
      //       // console.log(doc)
      //
      //       this.setState({ data: [...this.state.data,utag] })
      //       result = nodes.iterateNext();
      //
      //       // console.log(result.parentNode)
      //     }
      //     console.log(count)
      //   }





};




  render(){

    console.log(this.state)

    return(
      <div>


      <div>
     <select  value={this.state.selectValue}  onChange={this.handleChange}  >
      <option value="Utags">Utag</option>
       <option value="Send-Data-to-agent"> Send-Data-to-agent </option>
       <option value="Automaton"> automaton </option>
     </select>

     </div>


        <div>
            <input  name="searchTerm" placeholder="enter xml tag" type="text" value={this.state.searchTerm} onChange={this.onInputchange} required />
        </div>

        <button onClick={()=>this.getResponseXML("ups.xml")}> Search </button>
        {this.state.data}
      </div>
    )
  }
}


export default Main
