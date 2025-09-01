import { useEffect, useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";

import config from "../config";

const AdminPanel = () => {

  const navigate = useNavigate();
  const [whiteList, setWhiteList] = useState([]);
  const [blackList, setBlackList] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [selectedList, setSelectedList] = useState("whitelist");

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleRemoveWord = (word: string, listType: "whitelist" | "blacklist") => {
    fetch(config.apiUrl + (listType === "whitelist" ? '/whitelist-remove' : '/blacklist-remove'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ word })
    })
      .then((response) => response.json())
      .then(() => {
        fetchItemsFromServer();
      });
  };

  const handleAddWord = () => {
    if (newWord.trim() === "") return;

    fetch(config.apiUrl + (selectedList === "whitelist" ? '/whitelist-add' : '/blacklist-add'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ word: newWord })
    })
      .then((response) => response.json())
      .then(() => {
        setNewWord("");
        setSelectedList("whitelist");
        fetchItemsFromServer();
      });
  }

  const fetchItemsFromServer = () => {
    // Fetch the current word lists from the API
    fetch(config.apiUrl + '/whitelist')
      .then((response) => response.json())
      .then((data) => {
        setWhiteList(data.list || []);
      });
    fetch(config.apiUrl + '/blacklist')
      .then((response) => response.json())
      .then((data) => {
        setBlackList(data.list || []);
      });
  }

  useEffect(fetchItemsFromServer, []);

  return (
    <div className='flex min-h-screen bg-gray-100 justify-center w-full'>
      <div className='flex flex-col max-w-[800px] items-center min-h-screen w-full font-inter p-4'>
        <div className='flex flex-row items-center space-x-4 w-full'>
          <CiBoxList className='text-6xl text-primary mb-4' />
          <div className='flex flex-col'>
            <h1 className='text-4xl font-bold'>White and Black list management</h1>
            <p className=''>Configure the list of words that should be allowed as good and bad answers</p>
          </div>
        </div>
        <div className='flex flex-row space-x-4 w-full justify-end mt-10'>
          <button className='rounded p-2 bg-primary text-white cursor-pointer' onClick={handleGoDashboard}>
            <IoMdArrowBack className='text-lg inline-block mr-2' size={20}/>
            Back to the Tool
          </button>
        </div>
        <div className="border shadow border-gray-200 rounded p-4 w-full mt-10">
          <div>Add element to the list</div>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex flex-row flex-1 items-center gap-2">
              Word to add
              <input type="text" className="border rounded p-2 mt-1 flex-1" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
              <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)} className="border rounded p-2 mt-1">
                <option value="whitelist">White List</option>
                <option value="blacklist">Black List</option>
              </select>
              <button className="border rounded p-2 mt-1 bg-secondary text-white" onClick={handleAddWord}>Add</button>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full mt-10'>
          <h2 className='text-2xl font-bold'>Current Lists</h2>
          <div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-1 border-gray-300 bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold">White List</h3>
                <ul>
                  {whiteList.map((word, index) => (
                    <li key={index} className="flex items-center justify-between pt-2 border-b border-gray-300">{word}
                      <button onClick={() => handleRemoveWord(word, "whitelist")} className="cursor-pointer">
                        <FaRegTrashCan className="text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col flex-1 border-gray-600 bg-gray-200 p-4 rounded shadow">
                <h3 className="text-xl font-bold">Black List</h3>
                <ul>
                  {blackList.map((word, index) => (
                    <li key={index} className="flex items-center justify-between pt-2 border-b border-gray-500">{word}
                      <button onClick={() => handleRemoveWord(word, "blacklist")} className="cursor-pointer">
                        <FaRegTrashCan className="text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel;