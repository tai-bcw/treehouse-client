import { useEffect, useState } from "react";
import axios from "axios";
import { ROOT_TEST_URL, PLATFORM_INFO, REGISTRY_ASPECTS_OBJECT, SUBMIT_CAR } from '../../constants/endpoints';
import { Row, Col, Container, Card } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import JSONPretty from "react-json-pretty";

function Marker(){
    return(<span className="marker"><img src="https://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Push-Pin-1-Pink-icon.png"/></span>)
}


function CarMap(props) {
    console.log("GOOGL", props);

    return (
    <div style={{height: '50vh', width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{key: "AIzaSyDVt0Kce8FVRGyOX1_lDyDUEPic8p6Apuw"}}
        defaultCenter={props.defaultCenter}
        defaultZoom={props.zoom}
      >
        {
          props.scatter.map((scat,idx) => {
          return (
            <Marker key={idx} lat= {scat.lat} lng= {scat.lng}/>)}
          )
        }
  
      </GoogleMapReact>
    </div>
    )
}

function CarSelector(props) { // In a hurry, this one is going to be a bit hack
    const models = props.carStruct["Model"];
    const wheels = props.carStruct["Wheel"];
    const seats = props.carStruct["Seat"];

    const model_array = Object.keys(models).map(model => <option value={model}>{model}</option>)
    const wheel_array = Object.keys(wheels).map(model => <option value={model}>{model}</option>)
    const seat_array = Object.keys(seats).map(model => <option value={model}>{model}</option>)



    return (
        <>
        <Row>
        <Col md={4}>
            <h4>
            Pick a model
            </h4>
            <select className="form-select" onChange={(evt)=>props.setModel(evt.target.value)}>
                {model_array}
            </select>
        </Col>
        <Col md={4}>
            <h4>
            Pick Wheels
            </h4>
            <select className="form-select" onChange={(evt)=>props.setWheels(evt.target.value)}>
                {wheel_array}
            </select>
        </Col>
        <Col md={4}>
            <h4>
            Pick Seats
            </h4>
            <select className="form-select" onChange={(evt)=>props.setSeats(evt.target.value)}>
                {seat_array}
            </select>
        </Col>
      </Row>
      </>
    );
}


export default function CarBuilder(props) {

   const [contInfo, setContInfo] = useState({contract_id: null, contract_addr: null, contract_abi: null});
   const [aspects, setAspects] = useState(null);
   const [seats, setSeats] = useState("Black Seat");
   const [model, setModel] = useState("Model A");
   const [wheels, setWheels] = useState("W18");
   const [name, setName] = useState(null);
   const [statOne, setStatOne] = useState(null);
   const [map, setMap] = useState(null);
   const [loading, setLoading] = useState(false);

   console.log(seats, model, wheels, name)

   function submitCar() {
    if (!model || !seats || !wheels || !name) {
        setStatOne('Please select all options before proceeding')
        return;
    }

    const car_options = [{type: 'Wheel', name: wheels}, {type: 'Seat', name: seats}];
    const car_name = name;
    const car_model = model;
    setLoading(true)

    axios.post(`${ROOT_TEST_URL}${SUBMIT_CAR}`, {model: car_model, name: car_name, options: car_options}).then((resp)=>{
        console.log("RESP DATA", resp.data.data);
        setMap(resp.data.data);
        setLoading(false)
    });
   }


    useEffect(()=>{
        if (!contInfo.contract_id) {
          axios.get(`${ROOT_TEST_URL}${PLATFORM_INFO}`).then((resp)=>{
              setContInfo(resp.data)
          })
        }

        if (!aspects) {
          axios.get(`${ROOT_TEST_URL}${REGISTRY_ASPECTS_OBJECT}`).then(resp=> {
            setAspects(resp.data)
          })
        }
    })

    return (
        <>
            <h1>
            Car Builder
            </h1>


            <Card className="aspects-selection-wrapper">
            <h3>
            Registry Source
            </h3>
            <div>
            <table className="table">
              <tr>
                <th>Contract ID: </th> <td> {contInfo? <a href={`https://hashscan.io/testnet/contract/${contInfo.contract_id}`} target="_blank" rel="noreferrer">{contInfo.contract_id}</a> : ""} </td>
              </tr>
              <tr>
                <th>Contract EVM Address:</th> 
                <td>
                {contInfo? <a href={`https://hashscan.io/testnet/contract/${contInfo.contract_id}`} target="_blank" rel="noreferrer">{contInfo.contract_addr}</a>: ""}
                </td>
              </tr>
              <tr>
                <a href="/registry">View Registry Info</a>
              </tr>
            </table>
          </div>
          </Card>

          <br/>
          
          
          <Card className="aspects-selection-wrapper">
          <h2>Pick Car Options</h2>
            <input className="form-control" placeholder="Car Name" onChange={(evt)=>{setName(evt.target.value)}}></input>
            <br/>
            { aspects? <CarSelector setSeats={setSeats} setModel={setModel} setWheels={setWheels} carStruct={aspects.data}/> : "Loading From Registry" }
            <br/>
            <button className="btn btn-success" onClick={()=>{submitCar()}} >Submit Car</button> {statOne}
          </Card>
          <br/>

          {
            map?
            <Card className="car-report">
            <h1>Car Component Map </h1>

            <Row>
            <Col>
            <CarMap 
              defaultCenter={{lat: Number(map.details.lat), lng: Number(map.details.lng)}}
              zoom={1}
              scatter={map.layers.scatter_plot.data}
            />
            
            </Col>
            <Col>
             <div className="pretty">
              <JSONPretty data={JSON.stringify(map)}/>
              </div>
            </Col>
            </Row>
            </Card>
            : 
            loading? <> <img src="https://icons8.com/preloaders/preloaders/1495/Spinner-3.gif"/> Retrieving Vectors... </>: ""
          }
        </>
    )

}