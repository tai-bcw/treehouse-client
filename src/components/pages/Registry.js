import { useEffect, useState } from "react"
import { ROOT_TEST_URL, PLATFORM_INFO, REGISTRY_ASPECTS } from '../../constants/endpoints';
import axios from "axios";
import DataTable from "react-data-table-component";

function buildRegistryJSX(registryArray){
    
    const registry_data = registryArray.map((reg_info)=>{
        return {
            category: reg_info[1],
            name: reg_info[0],
            price: reg_info[2],
            manufacturer: reg_info[3],
            location: reg_info[4],
            weight: reg_info[5],
            options: [reg_info[6],reg_info[7], reg_info[8]]
        }
    })

    const columns = [
        {
            name: "Category",
            selector: row=>row.category
        },
        {
            name: "Name",
            selector: row=>row.name
        },
        {
            name: "Price",
            selector: row=>row.price
        },
        {
            name: "Manufacturer",
            selector: row=>row.manufacturer
        },
        {
            name: "Location",
            selector: row=>row.location
        },
        {
            name: "Weight",
            selector: row=>row.weight
        },
        {
            name: "Materials",
            selector: row=>row.options.join("/")
        }
    ]

    
    return (<DataTable columns={columns} data={registry_data}/>);
}


export default function Registry(props) {
    const [contInfo, setContInfo] = useState({contract_id: null, contract_addr: null, contract_abi: null});
    const [aspects, setAspects] = useState(null);

    useEffect(()=>{
        if (!contInfo.contract_id) {
          axios.get(`${ROOT_TEST_URL}${PLATFORM_INFO}`).then((resp)=>{
              setContInfo(resp.data)
          })
        }

        if (!aspects) {
          axios.get(`${ROOT_TEST_URL}${REGISTRY_ASPECTS}`).then(resp=> {
            setAspects(resp.data)
          })
        }
    })

    return (
        <>
            <h3>
              Registry Contract Info
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
                <th>Contract Source</th>
                <td>
                    <a href="https://github.com/kai1130/TreeHouse/blob/main/contracts/generic/THAspectsGeneric.sol" target="_blank" rel="noreferrer">
                        Source
                    </a>
                </td>
              </tr>
              <tr>
                <th>Contract ABI</th>
                <td>
                    <a href="https://github.com/kai1130/TreeHouse/blob/main/contract_bytecode/generic_controller/generic_abi.json" target="_blank" rel="noreferrer">
                        ABI
                    </a>
                </td>
              </tr>
            </table>
          </div>
          
          
          
          <div className="aspects-wrapper">
              {!aspects? "Loading Registry From Smart Contract..." : buildRegistryJSX(aspects.data)}
          </div>
        </>
    )
}