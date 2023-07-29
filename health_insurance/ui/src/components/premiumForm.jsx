import React from "react";
import axios from 'axios';

import { BASE_URL } from '../constants'
import '../css/form.css';

class PremiumInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        numberOfMembers: 0,
        formData: [],
        premiumData: {},
      };
  
      this.handleInputChange = this.handleInputChange.bind(this);
    };
  
    handleInputChange(event) {
        let { name, value } = event.target;
        if (value > 10) {
            value = 10
        }
        let defualtValue = []
        for (let i = 0; i < value; i++) {
            defualtValue.push({})
        }
        this.setState({
            [name]: value,
            formData: defualtValue,
          });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const premiumUrl = BASE_URL + '/calculate_premium'
        const payload = {
            "members": formData
        }

        const headers = {
            'Content-Type': 'application/json'
        }
        
        axios.post(premiumUrl,  payload, {headers: headers})
          .then((response) => {
            this.setState({ premiumData: response.data});
          })
          .catch((error) => {
            alert("Premium Not Found");
          });
      };
    
      // Handle form field changes
      handleChange = (index, e) => {
        const { formData } = this.state;
        const newValues = [...formData];
        const newValuesDict = newValues[index]
        newValuesDict[e.target.name] = e.target.value;
        newValues[index] =newValuesDict;
        this.setState({ formData: newValues });
      };

    getMemberDetails = (item, formData) => {
        return (
            <div style={{display: 'flex'}}>
                <div className="input-div">
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" name="age" value={formData.name} onChange={(e) => this.handleChange(item, e)} required />
                </div>

                <div className="input-div">
                    <label htmlFor="sumInsured">Sum Insured</label>
                    <input type="number" id="sumInsured" name="sumInsured" value={formData.email} onChange={(e) => this.handleChange(item, e)} required />
                </div>
                
                <div className="input-div">
                    <label htmlFor="cityTier">City Tier</label>
                    <input type="number" id="cityTier" name="cityTier" value={formData.cityTier} onChange={(e) => this.handleChange(item, e)} required />
                </div>

                <div className="input-div">
                    <label htmlFor="tenure">Tenure</label>
                    <input type="number" id="tenure" name="tenure" value={formData.tenure} onChange={(e) => this.handleChange(item, e)} required />
                </div>
            </div>
        )
    }

    render() {
        const { getMemberDetails } = this;
        const { numberOfMembers, premiumData } = this.state;
        const start = 1

        const getForm = (numberOfMembers, memberDetails) => {
            const rangeArray = Array.from({ length: numberOfMembers - start + 1 }, (_, index) => start + index);
            return rangeArray.map((item) => (
                <div key={item}>{getMemberDetails(item-1, {})}</div>
            ));
        }

        return (
            <div>
                <div className="input-div">
                    <label htmlFor="no_of_members">Number of Numbers: </label>
                    <input type="number" id="numberOfMembers" name="numberOfMembers" value={numberOfMembers} onChange={this.handleInputChange} required />
                </div>
                <form className="my-form" onSubmit={this.handleSubmit}>
                    {getForm(numberOfMembers)}
                    <button type="submit">Submit</button>
                </form> 

                {Object.keys(premiumData).length > 0 ? (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Base Rate</th>
                                <th>Floater Discount</th>
                                <th>Discounted Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {premiumData.premium.map((item, index) => (
                                    <tr key={index}>
                                        <td>Member {index}</td>
                                        <td>{item.age}</td>
                                        <td>{item.baseRate}</td>
                                        <td>{item.floaterDiscount}%</td>
                                        <td>{item.discountedRate}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td>{premiumData.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    {/* ) : ''} */}
                    </div>): ''
                }
            </div>

        );
    }
};

export default PremiumInput
