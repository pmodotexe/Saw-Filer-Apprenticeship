
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, Info, Search } from 'lucide-react';

const CalculatorCard = ({ title, children, formula, onShowFormula, showInfo, onShowInfo }) => (
  <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 shadow-lg w-full h-full flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl text-slate-800 flex items-center justify-between">
        {title}
        {showInfo && (
          <Button variant="ghost" size="sm" onClick={onShowInfo}>
            <Info className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      {children}
    </CardContent>
    {formula && (
      <div className="px-6 pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowFormula}
          className="w-full text-xs"
        >
          <Eye className="w-3 h-3 mr-1" /> Show Formula
        </Button>
      </div>
    )}
  </Card>
);

const PulleyCalculator = () => {
  const [values, setValues] = useState({ S: '', D: '', s: '', d: '' });
  const [result, setResult] = useState('Enter 3 values to calculate the 4th.');
  const [showFormula, setShowFormula] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleCalculate = () => {
    const { S, D, s, d } = values;
    const S_num = parseFloat(S);
    const D_num = parseFloat(D);
    const s_num = parseFloat(s);
    const d_num = parseFloat(d);
    
    if ([S, D, s, d].filter(v => v).length !== 3) {
      setResult('Please enter exactly three values.');
      return;
    }

    if (!S) setResult(`Driver Speed (S): ${(s_num * d_num / D_num).toFixed(2)} rpm`);
    else if (!D) setResult(`Driver Diameter (D): ${(s_num * d_num / S_num).toFixed(2)} inches`);
    else if (!s) setResult(`Driven Speed (s): ${(S_num * D_num / d_num).toFixed(2)} rpm`);
    else if (!d) setResult(`Driven Diameter (d): ${(S_num * D_num / s_num).toFixed(2)} inches`);
  };

  const reset = () => {
    setValues({ S: '', D: '', s: '', d: '' });
    setResult('Enter 3 values to calculate the 4th.');
  };

  return (
    <CalculatorCard 
      title="Pulley Speeds"
      formula="S × D = s × d"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div><Label htmlFor="S">Driver Speed (S, rpm)</Label><Input id="S" type="number" value={values.S} onChange={handleChange} placeholder="e.g., 1800"/></div>
        <div><Label htmlFor="D">Driver Diameter (D, in)</Label><Input id="D" type="number" value={values.D} onChange={handleChange} placeholder="e.g., 6"/></div>
        <div><Label htmlFor="s">Driven Speed (s, rpm)</Label><Input id="s" type="number" value={values.s} onChange={handleChange} placeholder="e.g., 900"/></div>
        <div><Label htmlFor="d">Driven Diameter (d, in)</Label><Input id="d" type="number" value={values.d} onChange={handleChange} placeholder="e.g., 12"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">S × D = s × d</p>
          <p className="text-xs text-blue-700 mt-1">Where S=Driver Speed, D=Driver Diameter, s=Driven Speed, d=Driven Diameter</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const SFPMCalculator = () => {
  const [values, setValues] = useState({ diameter: '', rpm: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);
  
  const handleCalculate = () => {
    const { diameter, rpm } = values;
    const diaNum = parseFloat(diameter);
    const rpmNum = parseFloat(rpm);
    if(isNaN(diaNum) || isNaN(rpmNum) || diaNum <= 0) {
      setResult("Invalid inputs.");
      return;
    }
    const sfpm = (diaNum * Math.PI * rpmNum) / 12;
    setResult(`SFPM: ${sfpm.toFixed(2)}`);
  };

  const reset = () => {
    setValues({ diameter: '', rpm: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Surface Feet Per Minute (SFPM)"
      formula="SFPM = (Diameter × π × RPM) ÷ 12"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="diameter">Diameter (in)</Label><Input id="diameter" type="number" value={values.diameter} onChange={e => setValues({...values, diameter: e.target.value})} placeholder="e.g., 10"/></div>
        <div><Label htmlFor="rpm">RPM</Label><Input id="rpm" type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 1000"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">SFPM = (Diameter × π × RPM) ÷ 12</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const RPMCalculator = () => {
  const [values, setValues] = useState({ sfpm: '', diameter: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { sfpm, diameter } = values;
    const sfpmNum = parseFloat(sfpm);
    const diaNum = parseFloat(diameter);
    if(isNaN(sfpmNum) || isNaN(diaNum) || diaNum <= 0) {
      setResult("Invalid inputs.");
      return;
    }
    const rpm = (sfpmNum * 12) / (Math.PI * diaNum);
    setResult(`RPM: ${rpm.toFixed(2)}`);
  };

  const reset = () => {
    setValues({ sfpm: '', diameter: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Revolutions Per Minute (RPM)"
      formula="RPM = (SFPM × 12) ÷ (π × Diameter)"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
       <div className="space-y-4">
        <div><Label htmlFor="sfpm">SFPM</Label><Input id="sfpm" type="number" value={values.sfpm} onChange={e => setValues({...values, sfpm: e.target.value})} placeholder="e.g., 2617"/></div>
        <div><Label htmlFor="diameter_rpm">Diameter (in)</Label><Input id="diameter_rpm" type="number" value={values.diameter} onChange={e => setValues({...values, diameter: e.target.value})} placeholder="e.g., 10"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">RPM = (SFPM × 12) ÷ (π × Diameter)</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const BandSawToothBiteStandardCalculator = () => {
  const [values, setValues] = useState({ pitch: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const pitchNum = parseFloat(values.pitch);
    if(isNaN(pitchNum) || pitchNum <= 0) {
      setResult("Invalid pitch value.");
      return;
    }
    const tb = pitchNum;
    setResult(`Tooth Bite: ${tb.toFixed(4)} inches`);
  };

  const reset = () => {
    setValues({ pitch: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Band Saw Tooth Bite (Standard 10 inches)"
      formula="TB = PT"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="bs_pitch_std">Tooth Pitch (PT, in)</Label><Input id="bs_pitch_std" type="number" value={values.pitch} onChange={e => setValues({...values, pitch: e.target.value})} placeholder="e.g., 2.5"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">TB = PT</p>
          <p className="text-xs text-blue-700 mt-1">For standard 10 inch wide saws</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const BandSawToothBiteMoreCalculator = () => {
  const [values, setValues] = useState({ pitch: '', sawWidth: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const pitchNum = parseFloat(values.pitch);
    const sawWidthNum = parseFloat(values.sawWidth);
    
    if(isNaN(pitchNum) || pitchNum <= 0) {
      setResult("Invalid pitch value.");
      return;
    }
    if(isNaN(sawWidthNum) || sawWidthNum <= 10) {
      setResult("Saw width must be greater than 10 inches.");
      return;
    }
    const tb = pitchNum + (sawWidthNum - 10) * (0.04 * pitchNum);
    setResult(`Tooth Bite: ${tb.toFixed(4)} inches`);
  };

  const reset = () => {
    setValues({ pitch: '', sawWidth: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Band Saw Tooth Bite (> 10 inches)"
      formula="TB = PT + (SW - 10) × (0.04 × PT)"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="bs_pitch_more">Tooth Pitch (PT, in)</Label><Input id="bs_pitch_more" type="number" value={values.pitch} onChange={e => setValues({...values, pitch: e.target.value})} placeholder="e.g., 2.5"/></div>
        <div><Label htmlFor="bs_sawwidth_more">Saw Width (SW, in)</Label><Input id="bs_sawwidth_more" type="number" value={values.sawWidth} onChange={e => setValues({...values, sawWidth: e.target.value})} placeholder="e.g., 12"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">TB = PT + (SW - 10) × (0.04 × PT)</p>
          <p className="text-xs text-blue-700 mt-1">For saws wider than 10 inches</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const BandSawToothBiteLessCalculator = () => {
  const [values, setValues] = useState({ pitch: '', sawWidth: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const pitchNum = parseFloat(values.pitch);
    const sawWidthNum = parseFloat(values.sawWidth);
    
    if(isNaN(pitchNum) || pitchNum <= 0) {
      setResult("Invalid pitch value.");
      return;
    }
    if(isNaN(sawWidthNum) || sawWidthNum >= 10) {
      setResult("Saw width must be less than 10 inches.");
      return;
    }
    const tb = pitchNum - (10 - sawWidthNum) * (0.04 * pitchNum);
    setResult(`Tooth Bite: ${tb.toFixed(4)} inches`);
  };

  const reset = () => {
    setValues({ pitch: '', sawWidth: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Band Saw Tooth Bite (< 10 inches)"
      formula="TB = PT - (10 - SW) × (0.04 × PT)"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="bs_pitch_less">Tooth Pitch (PT, in)</Label><Input id="bs_pitch_less" type="number" value={values.pitch} onChange={e => setValues({...values, pitch: e.target.value})} placeholder="e.g., 2.5"/></div>
        <div><Label htmlFor="bs_sawwidth_less">Saw Width (SW, in)</Label><Input id="bs_sawwidth_less" type="number" value={values.sawWidth} onChange={e => setValues({...values, sawWidth: e.target.value})} placeholder="e.g., 8"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">TB = PT - (10 - SW) × (0.04 × PT)</p>
          <p className="text-xs text-blue-700 mt-1">For saws narrower than 10 inches</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const KeyNumberBandSawCalculator = () => {
  const [values, setValues] = useState({ sfpm: '', pitch: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const sfpmNum = parseFloat(values.sfpm);
    const pitchNum = parseFloat(values.pitch);
    
    if(isNaN(sfpmNum) || isNaN(pitchNum) || pitchNum <= 0) {
      setResult("Invalid inputs.");
      return;
    }
    const keyNumber = sfpmNum / (pitchNum * 12);
    setResult(`Key Number: ${keyNumber.toFixed(2)}`);
  };

  const reset = () => {
    setValues({ sfpm: '', pitch: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Key Number for Band Saw Feed Speed"
      formula="Key Number = SFPM ÷ (PT × 12)"
      onShowFormula={() => setShowFormula(!showFormula)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="kn_sfpm">SFPM</Label><Input id="kn_sfpm" type="number" value={values.sfpm} onChange={e => setValues({...values, sfpm: e.target.value})} placeholder="e.g., 8000"/></div>
        <div><Label htmlFor="kn_pitch">Tooth Pitch (PT, in)</Label><Input id="kn_pitch" type="number" value={values.pitch} onChange={e => setValues({...values, pitch: e.target.value})} placeholder="e.g., 1.75"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Key Number = SFPM ÷ (PT × 12)</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const MinimumHorsepowerCalculator = () => {
  const [values, setValues] = useState({ gulletArea: '', teethPerMinute: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleCalculate = () => {
    const gulletAreaNum = parseFloat(values.gulletArea);
    const teethPerMinuteNum = parseFloat(values.teethPerMinute);
    
    if(isNaN(gulletAreaNum) || isNaN(teethPerMinuteNum) || gulletAreaNum <= 0 || teethPerMinuteNum <= 0) {
      setResult("Invalid inputs.");
      return;
    }
    const horsepower = gulletAreaNum * teethPerMinuteNum * 0.012;
    setResult(`Horsepower: ${horsepower.toFixed(3)} HP`);
  };

  const reset = () => {
    setValues({ gulletArea: '', teethPerMinute: '' });
    setResult('Result will appear here.');
  };

  return (
    <CalculatorCard 
      title="Minimum Horsepower Required"
      formula="HP = Gullet Area × TPM × 0.012"
      onShowFormula={() => setShowFormula(!showFormula)}
      showInfo={true}
      onShowInfo={() => setShowInfo(!showInfo)}
    >
      <div className="space-y-4">
        <div><Label htmlFor="hp_ga">Gullet Area (sq in)</Label><Input id="hp_ga" type="number" value={values.gulletArea} onChange={e => setValues({...values, gulletArea: e.target.value})} placeholder="e.g., 1.78"/></div>
        <div><Label htmlFor="hp_tpm">Teeth Per Minute</Label><Input id="hp_tpm" type="number" value={values.teethPerMinute} onChange={e => setValues({...values, teethPerMinute: e.target.value})} placeholder="e.g., 4800"/></div>
      </div>
      
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">HP = Gullet Area × TPM × 0.012</p>
        </div>
      )}

      {showInfo && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border-l-4 border-gray-400">
          <p className="text-sm text-gray-700 mb-3">Minimum horsepower refers to the amount of power needed to run the band saw. The power requirement depends on many factors including the depth of cut, kerf, feed speed, and the type of wood being cut. Some typical horsepower ratings for band saws are shown in this table:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 text-left font-semibold">Band Wheel Diameter</th>
                  <th className="px-3 py-2 text-left font-semibold">Horsepower</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="px-3 py-2 border-b">5 ft</td><td className="px-3 py-2 border-b">50-100 HP</td></tr>
                <tr><td className="px-3 py-2 border-b">6 ft</td><td className="px-3 py-2 border-b">100-150 HP</td></tr>
                <tr><td className="px-3 py-2 border-b">7 ft</td><td className="px-3 py-2 border-b">125-250 HP</td></tr>
                <tr><td className="px-3 py-2 border-b">8 ft</td><td className="px-3 py-2 border-b">150-300 HP</td></tr>
                <tr><td className="px-3 py-2 border-b">9 ft</td><td className="px-3 py-2 border-b">200-350 HP</td></tr>
                <tr><td className="px-3 py-2 border-b">10 ft</td><td className="px-3 py-2 border-b">250-400 HP</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const CircularToothBiteCalculator = () => {
  const [values, setValues] = useState({ feedSpeed: '', rpm: '', teeth: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { feedSpeed, rpm, teeth } = values;
    const feedNum = parseFloat(feedSpeed), rpmNum = parseFloat(rpm), teethNum = parseFloat(teeth);
    if(isNaN(feedNum) || isNaN(rpmNum) || isNaN(teethNum) || rpmNum <= 0 || teethNum <= 0) {
      setResult("Invalid inputs."); return;
    }
    const toothBite = feedNum / (rpmNum * teethNum);
    setResult(`Tooth Bite: ${toothBite.toFixed(4)} inches`);
  };
  
  const reset = () => { setValues({ feedSpeed: '', rpm: '', teeth: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Circular Tooth Bite" formula="TB = FS ÷ (RPM × T)" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Feed Speed (in/min)</Label><Input type="number" value={values.feedSpeed} onChange={e => setValues({...values, feedSpeed: e.target.value})} placeholder="e.g., 1200"/></div>
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
        <div><Label>Number of Teeth</Label><Input type="number" value={values.teeth} onChange={e => setValues({...values, teeth: e.target.value})} placeholder="e.g., 40"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Tooth Bite = Feed Speed ÷ (RPM × Number of Teeth)</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const KeyNumberCircularSawCalculator = () => {
  const [rpm, setRpm] = useState('');
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const rpmNum = parseFloat(rpm);
    if(isNaN(rpmNum) || rpmNum <= 0) { setResult("Invalid RPM."); return; }
    setResult(`Key Number: ${(rpmNum / 12).toFixed(2)}`);
  };
  
  const reset = () => { setRpm(''); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Key Number for Circular Saw" formula="KN = RPM ÷ 12" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>RPM</Label><Input type="number" value={rpm} onChange={e => setRpm(e.target.value)} placeholder="e.g., 3600"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Key Number = RPM ÷ 12</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const CircularSawFeedSpeedKeyNumberCalculator = () => {
  const [values, setValues] = useState({ keyNumber: '', distance: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { keyNumber, distance } = values;
    const kn = parseFloat(keyNumber), dist = parseFloat(distance);
    if(isNaN(kn) || isNaN(dist) || dist <= 0) { setResult("Invalid inputs."); return; }
    setResult(`Feed Speed: ${(kn * dist).toFixed(2)} in/min`);
  };
  
  const reset = () => { setValues({ keyNumber: '', distance: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Circular Saw Feed Speed (Key #)" formula="FS = KN × DTM" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Key Number</Label><Input type="number" value={values.keyNumber} onChange={e => setValues({...values, keyNumber: e.target.value})} placeholder="e.g., 300"/></div>
        <div><Label>Distance Between Tooth Marks (in)</Label><Input type="number" value={values.distance} onChange={e => setValues({...values, distance: e.target.value})} placeholder="e.g., 0.5"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Feed Speed = Key Number × Distance Between Tooth Marks</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const CircularSawFeedSpeedToothBiteCalculator = () => {
  const [values, setValues] = useState({ rpm: '', teeth: '', toothBite: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { rpm, teeth, toothBite } = values;
    const rpmNum = parseFloat(rpm), teethNum = parseFloat(teeth), tbNum = parseFloat(toothBite);
    if(isNaN(rpmNum) || isNaN(teethNum) || isNaN(tbNum) || rpmNum <= 0 || teethNum <= 0 || tbNum <= 0) {
      setResult("Invalid inputs."); return;
    }
    setResult(`Feed Speed: ${(rpmNum * teethNum * tbNum).toFixed(2)} in/min`);
  };
  
  const reset = () => { setValues({ rpm: '', teeth: '', toothBite: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Circular Saw Feed Speed (Tooth Bite)" formula="FS = RPM × T × TB" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
        <div><Label>Number of Teeth</Label><Input type="number" value={values.teeth} onChange={e => setValues({...values, teeth: e.target.value})} placeholder="e.g., 40"/></div>
        <div><Label>Tooth Bite (in)</Label><Input type="number" value={values.toothBite} onChange={e => setValues({...values, toothBite: e.target.value})} placeholder="e.g., 0.008"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Feed Speed = RPM × Number of Teeth × Tooth Bite</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const NumberOfTeethRequiredCalculator = () => {
  const [values, setValues] = useState({ feed: '', toothBite: '', rpm: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { feed, toothBite, rpm } = values;
    const feedNum = parseFloat(feed), tbNum = parseFloat(toothBite), rpmNum = parseFloat(rpm);
    if(isNaN(feedNum) || isNaN(tbNum) || isNaN(rpmNum) || rpmNum <= 0 || tbNum <= 0) {
      setResult("Invalid inputs."); return;
    }
    setResult(`Teeth Required: ${(feedNum / (tbNum * rpmNum)).toFixed(2)}`);
  };
  
  const reset = () => { setValues({ feed: '', toothBite: '', rpm: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Number of Teeth Required" formula="T = FPM ÷ (TB × RPM)" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Feed Per Minute (in/min)</Label><Input type="number" value={values.feed} onChange={e => setValues({...values, feed: e.target.value})} placeholder="e.g., 1200"/></div>
        <div><Label>Desired Tooth Bite (in)</Label><Input type="number" value={values.toothBite} onChange={e => setValues({...values, toothBite: e.target.value})} placeholder="e.g., 0.008"/></div>
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Teeth = Feed Per Minute ÷ (Desired Tooth Bite × RPM)</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const HorsepowerRequiredCircularSawCalculator = () => {
  const [values, setValues] = useState({ depth: '', feed: '', kerf: '', ef: '35', customEf: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { depth, feed, kerf, ef, customEf } = values;
    const depthNum = parseFloat(depth), feedNum = parseFloat(feed), kerfNum = parseFloat(kerf);
    const energyFactor = ef === 'custom' ? parseFloat(customEf) : parseFloat(ef);
    if(isNaN(depthNum) || isNaN(feedNum) || isNaN(kerfNum) || isNaN(energyFactor) || energyFactor <= 0) {
      setResult("Invalid inputs."); return;
    }
    setResult(`Horsepower: ${((depthNum * feedNum * kerfNum * energyFactor) / 144).toFixed(2)} HP`);
  };
  
  const reset = () => { setValues({ depth: '', feed: '', kerf: '', ef: '35', customEf: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Horsepower Required per Saw" formula="HP = (DoC × FS × K × EF) ÷ 144" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Depth of Cut (in)</Label><Input type="number" value={values.depth} onChange={e => setValues({...values, depth: e.target.value})} placeholder="e.g., 6"/></div>
        <div><Label>Feed Speed (in/min)</Label><Input type="number" value={values.feed} onChange={e => setValues({...values, feed: e.target.value})} placeholder="e.g., 1200"/></div>
        <div><Label>Kerf (in)</Label><Input type="number" value={values.kerf} onChange={e => setValues({...values, kerf: e.target.value})} placeholder="e.g., 0.125"/></div>
        <div>
          <Label>Energy Factor</Label>
          <Select onValueChange={val => setValues({...values, ef: val})} value={values.ef}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="35">American Softwoods (35)</SelectItem>
              <SelectItem value="40">Dry Fir (40)</SelectItem>
              <SelectItem value="70">Hardwoods (70)</SelectItem>
              <SelectItem value="custom">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {values.ef === 'custom' && (
          <div><Label>Custom Energy Factor</Label><Input type="number" value={values.customEf} onChange={e => setValues({...values, customEf: e.target.value})} placeholder="Enter custom EF"/></div>
        )}
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">HP = (Depth × Feed Speed × Kerf × EF) ÷ 144</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const CircularSawToothPitchCalculator = () => {
  const [values, setValues] = useState({ diameter: '', teeth: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { diameter, teeth } = values;
    const diaNum = parseFloat(diameter), teethNum = parseFloat(teeth);
    if(isNaN(diaNum) || isNaN(teethNum) || teethNum <= 0) { setResult("Invalid inputs."); return; }
    setResult(`Tooth Pitch: ${((diaNum * Math.PI) / teethNum).toFixed(2)} inches`);
  };
  
  const reset = () => { setValues({ diameter: '', teeth: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Circular Saw Tooth Pitch" formula="TP = (D × π) ÷ T" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Saw Diameter (in)</Label><Input type="number" value={values.diameter} onChange={e => setValues({...values, diameter: e.target.value})} placeholder="e.g., 20"/></div>
        <div><Label>Number of Teeth</Label><Input type="number" value={values.teeth} onChange={e => setValues({...values, teeth: e.target.value})} placeholder="e.g., 40"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Tooth Pitch = (Saw Diameter × π) ÷ Number of Teeth</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const ChipLoadCalculator = () => {
  const [values, setValues] = useState({ feedFpm: '', rpm: '', teeth: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleCalculate = () => {
    const { feedFpm, rpm, teeth } = values;
    const feedNum = parseFloat(feedFpm), rpmNum = parseFloat(rpm), teethNum = parseFloat(teeth);
    if(isNaN(feedNum) || isNaN(rpmNum) || isNaN(teethNum) || rpmNum <= 0 || teethNum <= 0) { setResult("Invalid inputs."); return; }
    setResult(`Chip Load: ${((feedNum * 12) / (rpmNum * teethNum)).toFixed(4)} inches`);
  };
  
  const reset = () => { setValues({ feedFpm: '', rpm: '', teeth: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Chip Load" formula="CL = (FPM × 12) ÷ (RPM × T)" onShowFormula={() => setShowFormula(!showFormula)} showInfo={true} onShowInfo={() => setShowInfo(!showInfo)}>
      <div className="space-y-4">
        <div><Label>Feed Speed (fpm)</Label><Input type="number" value={values.feedFpm} onChange={e => setValues({...values, feedFpm: e.target.value})} placeholder="e.g., 100"/></div>
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
        <div><Label>Number of Teeth</Label><Input type="number" value={values.teeth} onChange={e => setValues({...values, teeth: e.target.value})} placeholder="e.g., 40"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Chip Load = (Feed Speed (fpm) × 12) ÷ (RPM × Teeth)</p>
        </div>
      )}
      {showInfo && <p className="text-xs text-gray-500 mt-2">Guidelines: Gang Edger Saws at 0.030" - 0.045"</p>}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const RimSpeedCalculator = () => {
  const [values, setValues] = useState({ rpm: '', diameter: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { rpm, diameter } = values;
    const rpmNum = parseFloat(rpm), diaNum = parseFloat(diameter);
    if(isNaN(rpmNum) || isNaN(diaNum) || diaNum <= 0) { setResult("Invalid inputs."); return; }
    setResult(`Rim Speed: ${((rpmNum * diaNum * Math.PI) / 12).toFixed(2)} SFPM`);
  };
  
  const reset = () => { setValues({ rpm: '', diameter: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Rim Speed" formula="SFPM = (RPM × D × π) ÷ 12" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
        <div><Label>Saw Diameter (in)</Label><Input type="number" value={values.diameter} onChange={e => setValues({...values, diameter: e.target.value})} placeholder="e.g., 20"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Rim Speed (SFPM) = (RPM × Diameter × π) ÷ 12</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

const NumberOfTeethChipLoadCalculator = () => {
  const [values, setValues] = useState({ feedFpm: '', chipLoad: '', rpm: '' });
  const [result, setResult] = useState('Result will appear here.');
  const [showFormula, setShowFormula] = useState(false);

  const handleCalculate = () => {
    const { feedFpm, chipLoad, rpm } = values;
    const feedNum = parseFloat(feedFpm), clNum = parseFloat(chipLoad), rpmNum = parseFloat(rpm);
    if(isNaN(feedNum) || isNaN(clNum) || isNaN(rpmNum) || clNum <= 0 || rpmNum <= 0) { setResult("Invalid inputs."); return; }
    setResult(`Number of Teeth: ${((feedNum * 12) / (clNum * rpmNum)).toFixed(2)}`);
  };
  
  const reset = () => { setValues({ feedFpm: '', chipLoad: '', rpm: '' }); setResult('Result will appear here.'); };

  return (
    <CalculatorCard title="Number of Teeth (Chip Load)" formula="T = (FPM × 12) ÷ (CL × RPM)" onShowFormula={() => setShowFormula(!showFormula)}>
      <div className="space-y-4">
        <div><Label>Feed Rate (fpm)</Label><Input type="number" value={values.feedFpm} onChange={e => setValues({...values, feedFpm: e.target.value})} placeholder="e.g., 100"/></div>
        <div><Label>Chip Load (in)</Label><Input type="number" value={values.chipLoad} onChange={e => setValues({...values, chipLoad: e.target.value})} placeholder="e.g., 0.008"/></div>
        <div><Label>RPM</Label><Input type="number" value={values.rpm} onChange={e => setValues({...values, rpm: e.target.value})} placeholder="e.g., 3600"/></div>
      </div>
      {showFormula && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">Formula:</p>
          <p className="text-sm text-blue-800 font-mono">Teeth = (Feed Rate (fpm) × 12) ÷ (Chip Load × RPM)</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-100 rounded-md text-center font-medium text-blue-600">{result}</div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={reset}>Reset</Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </CalculatorCard>
  );
};

// --- New Data Structure for Calculators ---
const allCalculators = [
    { id: 'pulley', Component: PulleyCalculator, title: 'Pulley Speeds', category: 'general' },
    { id: 'sfpm', Component: SFPMCalculator, title: 'Surface Feet Per Minute (SFPM)', category: 'general' },
    { id: 'rpm', Component: RPMCalculator, title: 'Revolutions Per Minute (RPM)', category: 'general' },
    { id: 'bs_bite_std', Component: BandSawToothBiteStandardCalculator, title: 'Band Saw Tooth Bite (Standard 10 inches)', category: 'band-saw' },
    { id: 'bs_bite_more', Component: BandSawToothBiteMoreCalculator, title: 'Band Saw Tooth Bite (> 10 inches)', category: 'band-saw' },
    { id: 'bs_bite_less', Component: BandSawToothBiteLessCalculator, title: 'Band Saw Tooth Bite (< 10 inches)', category: 'band-saw' },
    { id: 'kn_bandsaw', Component: KeyNumberBandSawCalculator, title: 'Key Number for Band Saw Feed Speed', category: 'band-saw' },
    { id: 'min_hp', Component: MinimumHorsepowerCalculator, title: 'Minimum Horsepower Required', category: 'band-saw' },
    { id: 'cs_bite', Component: CircularToothBiteCalculator, title: 'Circular Tooth Bite', category: 'circular-saw' },
    { id: 'kn_circular', Component: KeyNumberCircularSawCalculator, title: 'Key Number for Circular Saw', category: 'circular-saw' },
    { id: 'cs_feed_kn', Component: CircularSawFeedSpeedKeyNumberCalculator, title: 'Circular Saw Feed Speed (Key #)', category: 'circular-saw' },
    { id: 'cs_feed_tb', Component: CircularSawFeedSpeedToothBiteCalculator, title: 'Circular Saw Feed Speed (Tooth Bite)', category: 'circular-saw' },
    { id: 'num_teeth', Component: NumberOfTeethRequiredCalculator, title: 'Number of Teeth Required', category: 'circular-saw' },
    { id: 'hp_circular', Component: HorsepowerRequiredCircularSawCalculator, title: 'Horsepower Required per Saw', category: 'circular-saw' },
    { id: 'cs_pitch', Component: CircularSawToothPitchCalculator, title: 'Circular Saw Tooth Pitch', category: 'circular-saw' },
    { id: 'chip_load', Component: ChipLoadCalculator, title: 'Chip Load', category: 'circular-saw' },
    { id: 'rim_speed', Component: RimSpeedCalculator, title: 'Rim Speed', category: 'circular-saw' },
    { id: 'num_teeth_cl', Component: NumberOfTeethChipLoadCalculator, title: 'Number of Teeth (Chip Load)', category: 'circular-saw' },
];


export default function Calculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState([]);

  const filteredCalculators = useMemo(() => {
    if (!searchTerm) return allCalculators;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allCalculators.filter(calc =>
      calc.title.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      const categories = [...new Set(filteredCalculators.map(c => c.category))];
      setOpenSections(categories);

      if (categories.length > 0) {
        // Use a timeout to ensure the DOM has updated after state change
        setTimeout(() => {
          const firstSectionId = categories[0];
          const element = document.getElementById(firstSectionId);
          if (element) {
            const headerOffset = 80; // Account for fixed header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    } else {
      setOpenSections([]); // Collapse all sections when search is cleared
    }
  }, [searchTerm, filteredCalculators]);

  const renderCalculators = (category) => {
    const calcs = filteredCalculators.filter(c => c.category === category);
    if (calcs.length === 0) {
        return <p className="text-slate-500 col-span-full text-center py-4">No matching calculators found in this category.</p>;
    }
    return calcs.map(({ Component, id }) => <Component key={id} />);
  };


  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm p-4 sm:p-8">
      <div className="max-w-7xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Calculators
            </span>
          </h1>
          <p className="text-slate-600 text-lg">Essential calculations for precision filing.</p>
          
          {/* Disclaimer */}
          <div className="mt-4 max-w-2xl mx-auto bg-blue-50/70 border-l-4 border-blue-300 text-blue-800 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-left">
                Always check manufacturer's literature for specifications.
              </p>
            </div>
          </div>

          {/* Additional Note */}
          <div className="mt-3 max-w-2xl mx-auto bg-amber-50/70 border-l-4 border-amber-300 text-amber-800 p-3 rounded-r-lg">
            <p className="text-sm text-center">
              More calculators are being added, thank you for your patience.
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl mx-auto mb-12"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search for a calculator or formula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-base rounded-full shadow-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Accordion 
            type="multiple" 
            collapsible 
            className="w-full space-y-4"
            value={openSections}
            onValueChange={setOpenSections}
          >
            <AccordionItem value="general" id="general" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">General Formulas</AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderCalculators('general')}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="band-saw" id="band-saw" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">Band Saw Formulas</AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderCalculators('band-saw')}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="circular-saw" id="circular-saw" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">Circular Saw Formulas</AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderCalculators('circular-saw')}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
