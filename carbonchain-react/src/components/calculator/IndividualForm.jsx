import React, { forwardRef, useImperativeHandle, useState } from 'react';

const IndividualForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    bodyType: 'normal',
    sex: 'female',
    diet: 'omnivore',
    transport: 'public',
    vehicleType: 'petrol',
    vehicleDistance: '150',
    airTravel: 'rarely',
    heatingSource: 'natural gas',
    groceryBill: '200',
    shower: 'daily',
    wasteSize: 'medium',
    wasteCount: '3',
    social: 'sometimes',
    clothesMonthly: '2',
    tvPcHours: '4',
    internetHours: '6',
    energyEfficiency: 'Sometimes',
    recycling: "['Paper']",
    cookingWith: "['Stove']"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useImperativeHandle(ref, () => ({
    getPayload: () => ({
      'Body Type': formData.bodyType,
      'Sex': formData.sex,
      'Diet': formData.diet,
      'How Often Shower': formData.shower,
      'Heating Energy Source': formData.heatingSource,
      'Transport': formData.transport,
      'Vehicle Type': formData.vehicleType || '',
      'Social Activity': formData.social,
      'Monthly Grocery Bill': +formData.groceryBill,
      'Frequency of Traveling by Air': formData.airTravel,
      'Vehicle Monthly Distance Km': +formData.vehicleDistance,
      'Waste Bag Size': formData.wasteSize,
      'Waste Bag Weekly Count': +formData.wasteCount,
      'How Long TV PC Daily Hour': +formData.tvPcHours,
      'How Many New Clothes Monthly': +formData.clothesMonthly,
      'How Long Internet Daily Hour': +formData.internetHours,
      'Energy efficiency': formData.energyEfficiency,
      'Recycling': formData.recycling,
      'Cooking_With': formData.cookingWith
    })
  }));

  return (
    <div>
      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-yellow">👤</span> Personal Details</h3>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">Body Type</label>
            <select className="form-select" name="bodyType" value={formData.bodyType} onChange={handleChange}>
              <option value="underweight">Underweight</option>
              <option value="normal">Normal</option>
              <option value="overweight">Overweight</option>
              <option value="obese">Obese</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sex</label>
            <select className="form-select" name="sex" value={formData.sex} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Diet</label>
          <select className="form-select" name="diet" value={formData.diet} onChange={handleChange}>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
          </select>
        </div>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-blue">🚗</span> Transportation</h3>
        <div className="form-group">
          <label className="form-label">Primary Transport</label>
          <select className="form-select" name="transport" value={formData.transport} onChange={handleChange}>
            <option value="public">Public Transport</option>
            <option value="walk/bicycle">Walk / Bicycle</option>
            <option value="private">Private Vehicle</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Vehicle Type</label>
          <select className="form-select" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
            <option value="">None</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
            <option value="lpg">LPG</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Monthly Distance (Km)</label>
          <input type="number" name="vehicleDistance" className="form-input" value={formData.vehicleDistance} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Air Travel Frequency</label>
          <select className="form-select" name="airTravel" value={formData.airTravel} onChange={handleChange}>
            <option value="never">Never</option>
            <option value="rarely">Rarely</option>
            <option value="frequently">Frequently</option>
            <option value="very frequently">Very Frequently</option>
          </select>
        </div>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-green">🏠</span> Household & Consumption</h3>
        <div className="form-group">
          <label className="form-label">Heating Source</label>
          <select className="form-select" name="heatingSource" value={formData.heatingSource} onChange={handleChange}>
            <option value="coal">Coal</option>
            <option value="natural gas">Natural Gas</option>
            <option value="wood">Wood</option>
            <option value="electricity">Electricity</option>
          </select>
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">Monthly Grocery ($)</label>
            <input type="number" name="groceryBill" className="form-input" value={formData.groceryBill} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Shower Frequency</label>
            <select className="form-select" name="shower" value={formData.shower} onChange={handleChange}>
              <option value="daily">Daily</option>
              <option value="less frequently">Less Frequently</option>
              <option value="more frequently">More Frequently</option>
              <option value="twice a day">Twice a Day</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">Waste Bag Size</label>
            <select className="form-select" name="wasteSize" value={formData.wasteSize} onChange={handleChange}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra large">Extra Large</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bags per week</label>
            <input type="number" name="wasteCount" className="form-input" value={formData.wasteCount} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-purple">✨</span> Lifestyle</h3>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">Social Activity</label>
            <select className="form-select" name="social" value={formData.social} onChange={handleChange}>
              <option value="never">Never</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">New Clothes/Month</label>
            <input type="number" name="clothesMonthly" className="form-input" value={formData.clothesMonthly} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">TV/PC Hours/Day</label>
            <input type="number" name="tvPcHours" className="form-input" value={formData.tvPcHours} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Internet Hours/Day</label>
            <input type="number" name="internetHours" className="form-input" value={formData.internetHours} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Energy Efficiency</label>
          <select className="form-select" name="energyEfficiency" value={formData.energyEfficiency} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Recycling</label>
          <select className="form-select" name="recycling" value={formData.recycling} onChange={handleChange}>
            <option value="['Paper']">Paper</option>
            <option value="['Plastic']">Plastic</option>
            <option value="['Glass']">Glass</option>
            <option value="['Metal']">Metal</option>
            <option value="['Paper', 'Plastic']">Paper + Plastic</option>
            <option value="['Paper', 'Glass']">Paper + Glass</option>
            <option value="['Paper', 'Metal']">Paper + Metal</option>
            <option value="['Plastic', 'Glass']">Plastic + Glass</option>
            <option value="['Plastic', 'Metal']">Plastic + Metal</option>
            <option value="['Glass', 'Metal']">Glass + Metal</option>
            <option value="['Paper', 'Plastic', 'Glass']">Paper + Plastic + Glass</option>
            <option value="['Paper', 'Plastic', 'Metal']">Paper + Plastic + Metal</option>
            <option value="['Paper', 'Glass', 'Metal']">Paper + Glass + Metal</option>
            <option value="['Plastic', 'Glass', 'Metal']">Plastic + Glass + Metal</option>
            <option value="['Paper', 'Plastic', 'Glass', 'Metal']">All</option>
            <option value="[]">None</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Cooking With</label>
          <select className="form-select" name="cookingWith" value={formData.cookingWith} onChange={handleChange}>
            <option value="['Stove']">Stove</option>
            <option value="['Oven']">Oven</option>
            <option value="['Microwave']">Microwave</option>
            <option value="['Stove', 'Oven']">Stove + Oven</option>
            <option value="['Stove', 'Microwave']">Stove + Microwave</option>
            <option value="['Oven', 'Microwave']">Oven + Microwave</option>
            <option value="['Stove', 'Oven', 'Microwave']">Stove + Oven + Microwave</option>
            <option value="['Grill', 'Airfryer']">Grill + Airfryer</option>
            <option value="['Stove', 'Grill', 'Airfryer']">Stove + Grill + Airfryer</option>
            <option value="['Microwave', 'Grill', 'Airfryer']">Microwave + Grill + Airfryer</option>
            <option value="['Oven', 'Grill', 'Airfryer']">Oven + Grill + Airfryer</option>
            <option value="['Stove', 'Oven', 'Grill', 'Airfryer']">Stove + Oven + Grill + Airfryer</option>
            <option value="['Stove', 'Microwave', 'Grill', 'Airfryer']">Stove + Microwave + Grill + Airfryer</option>
            <option value="['Oven', 'Microwave', 'Grill', 'Airfryer']">Oven + Microwave + Grill + Airfryer</option>
            <option value="['Stove', 'Oven', 'Microwave', 'Grill', 'Airfryer']">All</option>
            <option value="[]">None</option>
          </select>
        </div>
      </div>
    </div>
  );
});

export default IndividualForm;
