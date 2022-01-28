import React from 'react'

class Main extends React.Component{

constructor(props) {
   super(props);
   this.state = { data: [] , searchTerm: 'automatonDatapass' , selection: 'Variables'};
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




variables(xml){

  let count =0

   // let path = "//map-set/map-variable-ref //NOT AS EXACT
  // let path = "//map-set/map-variable-ref[@var-id='automatonDatapass']" // WORKS FOR AUTOMATOR DATA REFS
  let path = `//map-variable-ref[@var-id='${this.state.searchTerm}'] ` // WORKS FOR AUTOMATOR DATA REFS


  if (xml.evaluate) {
      let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      console.log(nodes)

      let result = nodes.iterateNext();

      while (result) {
        count++

        // automatonDatapass
        // console.log(result.parentNode.getElementsByTagName('key')[0])

        if (result.parentNode.getElementsByTagName('key')[0] !== undefined){

          let data = result.parentNode.getElementsByTagName('key')[0].getElementsByTagName('string')[0].innerHTML
          this.setState({ data: [...this.state.data,data] })
        }

        result = nodes.iterateNext();
      }
      console.log(count)
    }
}




tags(xml){

  let count =0

  // let path = "//send-data-to-agent/*/*/*" //WORKS FOR TAGS
  let path =  `//${this.state.searchTerm}/*`  //WORKS FOR TAGS





  if (xml.evaluate) {
      let nodes = xml.evaluate( path , xml, null, XPathResult.ANY_TYPE, null);
      // console.log(nodes)

      let result = nodes.iterateNext();

      while (result) {
        count++

        // let data = result.parentNode.getElementsByTagName('key')[0].getElementsByTagName('string')[0].innerHTML


         console.log(result)

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
    case 'Variables':
       this.variables(xml)
      break;
      case 'Tags':
         this.tags(xml)
        break;
    default:
      // code block
  }


  // this.books(xml)
    // this.utags(xml)
    // this.automaton(xml)


// this.tags(xml)


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



    const renderData=()=>{

      let set = new Set([...this.state.data]);
      let arr = [...set]

      console.log(arr)
        if(set.size > 0){
            return arr.map((item, i) => {
              return <div> {item.toLowerCase()}</div>
            });

        }

    }



    return(
      <div>


      <div>
     <select  value={this.state.selectValue}  onChange={this.handleChange}  >
      <option value="Utags">Utag</option>
       <option value="Tags"> Tags </option>
       <option value="Variables"> Variables </option>
     </select>

     </div>


        <div>
            <input  name="searchTerm" placeholder="enter xml tag" type="text" value={this.state.searchTerm} onChange={this.onInputchange} required />
        </div>

        <button onClick={()=>this.getResponseXML("ups.xml")}> Search </button>

        {renderData()}
      </div>
    )
  }
}


export default Main
