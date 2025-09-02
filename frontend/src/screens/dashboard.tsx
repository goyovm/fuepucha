import { useState } from 'react';
import {MdOutlineSecurity} from 'react-icons/md';
import { BiAngry, BiHappy } from "react-icons/bi";
import { CiBoxList } from "react-icons/ci";
import { AiOutlineLoading } from "react-icons/ai";


import config from '../config';
import { useNavigate } from 'react-router-dom';

type AnalyzeResult = {
  hasProfanity: boolean;
  severity: number;
  maskedText: string;
};

const DashboardScreen = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const handleGoAdmin = () => {
    navigate('/admin');
  };

  const handleAnalyze = () => {
    if (text !== '') {
      setResult(null);
      setLoading(true);
      fetch(config.apiUrl + '/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.codeStatus === 200) {
            setResult(data.result);
          } else {
            setResult(null);
          }
        }).catch((error) => {
          setLoading(false);
          console.error('Error analyzing text:', { error });
        });
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-100 justify-center w-full'>
      <div className='flex flex-col max-w-[800px] items-center min-h-screen w-full font-inter p-4'>
        <div className='flex flex-row items-center space-x-4 w-full'>
          <MdOutlineSecurity className='text-6xl text-primary mb-4' />
          <div className='flex flex-col'>
            <h1 className='text-4xl font-bold'>Profanity Detection</h1>
            <p className=''>Tool to detect profanity in text</p>
          </div>
        </div>
        <div className='flex flex-row space-x-4 w-full justify-end mt-10'>
          <button className='rounded p-2 bg-primary text-white cursor-pointer' onClick={handleGoAdmin}>
            <CiBoxList className='text-lg inline-block mr-2' size={20}/>
            Configure white and black lists
          </button>
        </div>
        <div className='flex flex-col mt-10 w-full'>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className='w-full p-2 border border-gray-300 rounded' rows={4} placeholder='Enter text to analyze...'></textarea>
          <button onClick={handleAnalyze} className='mt-2 w-full bg-primary text-white p-2 rounded cursor-pointer'>
            Analyze {loading && <AiOutlineLoading className='animate-spin inline-block ml-2' />}
          </button>
        </div>
        {result && (
          <div className='flex flex-col w-full mt-10'>
            <h2 className='text-2xl font-bold'>Results</h2>
            <div className='bg-white shadow-md rounded p-4 flex flex-col mt-2'>
              <div className='flex flex-row justify-between items-center border-b border-gray-200 pb-2'>
                <div className=''>The text has profanity?</div>
                <div className='mt-2'>{result.hasProfanity ?
                  (<div className='flex flex-row gap-2'>
                    <div>Yes</div>
                    <BiAngry className='text-red-500 text-2xl' />
                    </div>) :
                  (<div className='flex flex-row gap-2'>
                    <div>No</div>
                    <BiHappy className='text-green-500 text-2xl' />
                  </div>)}
                </div>
              </div>
              {result.hasProfanity &&<div className='mt-2 border-b border-gray-200 py-2 flex flex-row justify-between items-center'>
                <div>
                Severity
                </div>
                <div>
                  {result.severity}
                </div>
              </div>}
              {result.hasProfanity && <div className='mt-2 border-b border-gray-200 py-2 flex flex-row justify-between items-center'>
                <div>
                  Severity
                </div>
                <div>
                  {result.severity}
                </div>
              </div>}
              <div className='mt-2 pt-2 flex flex-row justify-between items-center'>
                <div>
                  Masked Text
                </div>
                <div>{result.maskedText}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardScreen;