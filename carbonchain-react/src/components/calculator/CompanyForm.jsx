import React, { forwardRef, useImperativeHandle, useState } from 'react';

const CompanyForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    personalKm: '5000',
    publicKm: '2000',
    plane: '10',
    train: '5',
    elec: '12000',
    water: '50000',
    waste: '200',
    diet: 'Both'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useImperativeHandle(ref, () => ({
    getPayload: () => ({
      'Personal_Vehicle_Km': +formData.personalKm,
      'Public_Vehicle_Km': +formData.publicKm,
      'Plane_Journey_Count': +formData.plane,
      'Train_Journey_Count': +formData.train,
      'Electricity_Kwh': +formData.elec,
      'Water_Usage_Liters': +formData.water,
      'Diet_Type': formData.diet,
      'Waste_Kg': +formData.waste
    })
  }));

  return (
    <div>
      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-blue">🚛</span> Logistics & Travel</h3>
        <div className="form-group">
          <label className="form-label">Annual Business Travel - Personal Vehicles (Km)</label>
          <input type="number" name="personalKm" className="form-input" value={formData.personalKm} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Business Travel - Public Transport (Km)</label>
          <input type="number" name="publicKm" className="form-input" value={formData.publicKm} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-[15px]">
          <div className="form-group">
            <label className="form-label">Plane Journeys (Count)</label>
            <input type="number" name="plane" className="form-input" value={formData.plane} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Train Journeys (Count)</label>
            <input type="number" name="train" className="form-input" value={formData.train} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4">
        <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-yellow">🏢</span> Office Operations</h3>
        <div className="form-group">
          <label className="form-label">Annual Electricity (kWh)</label>
          <input type="number" name="elec" className="form-input" value={formData.elec} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Water Usage (Liters)</label>
          <input type="number" name="water" className="form-input" value={formData.water} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Monthly Waste Production (Kg)</label>
          <input type="number" name="waste" className="form-input" value={formData.waste} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Corporate Diet / Canteen Type</label>
          <select className="form-select" name="diet" value={formData.diet} onChange={handleChange}>
            <option value="Both">Both (Mixed Options)</option>
            <option value="Veg">Vegetarian Only</option>
            <option value="MostlyVeg">Mostly Vegetarian</option>
            <option value="NonVeg">Non-Vegetarian Focused</option>
            <option value="MostlyNonVeg">Mostly Non-Vegetarian</option>
          </select>
        </div>
      </div>
    </div>
  );
});

export default CompanyForm;
