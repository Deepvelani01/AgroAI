// import React, { useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";

// function Home() {
//   const [model, setModel] = useState(null);
//   const [imageURL, setImageURL] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const [topPrediction, setTopPrediction] = useState(null);

//   const diseaseLabels = [
//     "Anthracnose",
//     "Bacterial Canker",
//     "Cutting Weevil",
//     "Die Back",
//     "Gall Midge",
//     "Healthy",
//     "Powdery Mildew",
//     "Scab",
//     "Tracin"
//   ];

//   useEffect(() => {
//     const loadModel = async () => {
//       try {
//         const loadedModel = await tf.loadGraphModel("/tfjs_model_output/model.json");
//         setModel(loadedModel);
//         console.log("✅ Model loaded successfully");
//       } catch (error) {
//         console.error("❌ Error loading model:", error);
//       }
//     };

//     loadModel();
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const imageUrl = URL.createObjectURL(file);
//     setImageURL(imageUrl);
//     setPrediction(null);
//     setTopPrediction(null);
//   };

//   const predict = async () => {
//     if (!model || !imageURL) return;

//     const img = document.getElementById("input-image");

//     const tensor = tf.browser
//       .fromPixels(img)
//       .resizeNearestNeighbor([242, 242])
//       .toFloat()
//       .div(255.0)
//       .expandDims();

//     const predictionTensor = model.predict(tensor);
//     const predictionData = await predictionTensor.data();

//     const resultArray = Array.from(predictionData);
//     setPrediction(resultArray);

//     const maxIndex = resultArray.indexOf(Math.max(...resultArray));
//     setTopPrediction({
//       label: diseaseLabels[maxIndex],
//       confidence: (resultArray[maxIndex] * 100).toFixed(2) + "%"
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-10 px-4 text-center">
//       <h1 className="text-4xl font-bold text-green-800 mb-6">Detect The Disease Of Mango </h1>

//       <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="block w-full mb-4 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//         />

//         {imageURL && (
//           <div>
//             <img
//               id="input-image"
//               src={imageURL}
//               alt="Uploaded"
//               className="w-64 mx-auto rounded-lg shadow-md"
//             />
//             <button
//               onClick={predict}
//               className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//             >
//               Detect Disease
//             </button>
//           </div>
//         )}

//         {topPrediction && (
//           <div className="mt-6 bg-green-50 p-4 rounded-xl shadow-inner">
//             <h3 className="text-xl font-semibold text-green-800">🔍 Predicted Disease:</h3>
//             <p className="text-lg text-green-700 font-bold">
//               {topPrediction.label} ({topPrediction.confidence})
//             </p>
//           </div>
//         )}

//         {prediction && (
//           <div className="mt-4 text-left">
//             <h4 className="text-green-800 font-semibold">📊 Confidence Levels:</h4>
//             <ul className="mt-2 space-y-1">
//               {prediction.map((val, idx) => (
//                 <li key={idx} className="text-sm text-gray-800">
//                   {diseaseLabels[idx]}: {(val * 100).toFixed(2)}%
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Assuming you have some global styles

function Home() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const navigate = useNavigate();

  // Example list of crops (hardcoded for frontend-only)
  const availableCrops = [
    
    'Cotton',
    'Potatoes',
    'Mango', // Added Mango
  ];

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  const handleProceedDetection = () => {
    if (selectedCrop) {
      // Navigate to the DiseaseDetection page, passing the selected crop as state
      navigate('/DiseaseDetection', { state: { crop: selectedCrop } });
    } else {
      alert("Please select a crop first!");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">AgroAI Crop Detection</h1>
        <p className="mb-6 text-center text-gray-600">Select a crop to proceed with disease detection:</p>

        <div className="mb-6">
          <label htmlFor="crop-select" className="block text-lg font-medium text-gray-700 mb-2">
            Choose a Crop:
          </label>
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={handleCropChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
          >
            <option value="" disabled>-- Select a crop --</option>
            {availableCrops.map((crop, index) => (
              <option key={index} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleProceedDetection}
          disabled={!selectedCrop}
          className={`w-full p-3 rounded-lg text-white font-semibold text-lg transition ${
            selectedCrop ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Proceed to Detection
        </button>

        {selectedCrop && (
          <p className="mt-6 text-center text-gray-700">
            You selected: <span className="font-bold text-green-600">{selectedCrop}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
