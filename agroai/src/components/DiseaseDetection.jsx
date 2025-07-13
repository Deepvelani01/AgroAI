import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js
import '../index.css'; // Assuming you have some global styles

function DiseaseDetection() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCrop = location.state?.crop || 'Unknown Crop';

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState(null);

  // useRef to store the loaded model, so it persists across re-renders
  const modelRef = useRef(null);
  // useRef for labels (model output mapping)
  const labelsRef = useRef({});

  // Define model paths and corresponding labels
  // IMPORTANT: Adjust these paths and labels to match your actual models!
  const cropModelInfo = {
    'Mango': {
      path: '/mango/model.json',
      labels: ["Anthracnose",
    "Bacterial Canker",
    "Cutting Weevil",
    "Die Back",
    "Gall Midge",
    "Healthy",
    "Powdery Mildew",
    "Scab",
    "Tracin"] // Example labels
    },
    'Potato': {
      path: '/models/potato/model.json',
      labels: ['Healthy', 'Early Blight', 'Late Blight'] // Example labels
    },
    'Groundnut': {
      path: '/models/groundnut/model.json',
      labels: ['Healthy', 'Early Leaf Spot', 'Late Leaf Spot', 'Rust'] // Example labels
    },
    'Cotton': {
      path: '/models/cotton/model.json',
      labels: ['Healthy', 'Bacterial Blight', 'Fusarium Wilt'] // Example labels
    },
    // Add more crops as needed
  };

  // Effect to load the TF.js model when the component mounts or selectedCrop changes
  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      setError(null);
      setDetectionResult(null); // Clear previous results when a new model is loaded

      const modelInfo = cropModelInfo[selectedCrop];
      if (!modelInfo) {
        setError(`No model information found for ${selectedCrop}.`);
        setModelLoading(false);
        return;
      }

      try {
        console.log(`Loading model for ${selectedCrop} from ${modelInfo.path}...`);
        const loadedModel = await tf.loadGraphModel(modelInfo.path); // Use loadGraphModel for Keras-converted models
        modelRef.current = loadedModel;
        labelsRef.current = modelInfo.labels;
        console.log(`Model for ${selectedCrop} loaded successfully.`);
      } catch (err) {
        console.error('Error loading model:', err);
        setError(`Failed to load model for ${selectedCrop}. Please check the model path and files.`);
      } finally {
        setModelLoading(false);
      }
    };

    if (selectedCrop && cropModelInfo[selectedCrop]) {
      loadModel();
    } else {
      setModelLoading(false); // No specific crop selected or no model info
    }

    // Cleanup function: dispose of the model when the component unmounts
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
        console.log('Model disposed.');
      }
    };
  }, [selectedCrop]); // Re-run this effect if selectedCrop changes

  // Effect to clean up image preview URL when component unmounts or image changes
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setDetectionResult(null); // Clear previous results
      setError(null); // Clear previous errors
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  // Function to preprocess the image for the model
  // IMPORTANT: You MUST adjust this function based on your model's exact input requirements!
  const preprocessImage = (imageElement) => {
    // Example: Resize to 224x224 and normalize to [0, 1]
    return tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([242, 242]) // Resize to model's expected input size
      .toFloat() // Convert to float
      .div(tf.scalar(255)) // Normalize pixel values to 0-1
      .expandDims(); // Add a batch dimension (e.g., from [224, 224, 3] to [1, 224, 224, 3])
  };

  const handleDetectDisease = async () => {
    if (!selectedImage) {
      alert('Please upload an image first!');
      return;
    }
    if (!modelRef.current) {
      alert('Model is not loaded yet. Please wait or try again.');
      return;
    }

    setLoading(true);
    setDetectionResult(null);
    setError(null);

    try {
      const img = new Image();
      img.src = imagePreview; // Use the object URL for the image element
      img.onload = async () => {
        const preprocessedImage = preprocessImage(img);

        // Perform prediction
        const predictions = modelRef.current.predict(preprocessedImage);
        const scores = await predictions.data(); // Get the raw prediction scores
        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        const predictedLabel = labelsRef.current[maxScoreIndex];
        const confidence = (scores[maxScoreIndex] * 100).toFixed(2) + '%';

        // Dispose of tensors to free up memory
        preprocessedImage.dispose();
        predictions.dispose();

        // Simulate symptoms and treatment based on the predicted label
        let symptoms = 'No specific symptoms provided by model.';
        let treatment = 'Consult an expert for further advice.';

        // You'd have more sophisticated mapping here based on your model's output
        if (predictedLabel === 'Anthracnose') {
          symptoms = 'Black spots on leaves and fruit, often sunken.';
          treatment = 'Fungicide application, proper pruning, improve air circulation.';
        } else if (predictedLabel === 'Late Blight') {
          symptoms = 'Dark, water-soaked spots on leaves; white mold on undersides.';
          treatment = 'Fungicide sprays, resistant varieties, proper spacing.';
        } else if (predictedLabel === 'Early Leaf Spot') {
          symptoms = 'Small, dark spots with yellow halos on leaves.';
          treatment = 'Resistant cultivars, crop rotation, fungicide application.';
        } else if (predictedLabel === 'Bacterial Blight') {
          symptoms = 'Water-soaked lesions on cotyledons, angular spots on leaves.';
          treatment = 'Resistant varieties, seed treatment, crop residue management.';
        } else if (predictedLabel === 'Healthy') {
          symptoms = 'No visible disease symptoms.';
          treatment = 'Continue good agricultural practices.';
        }

        setDetectionResult({
          disease: predictedLabel,
          confidence: confidence,
          symptoms: symptoms,
          treatment: treatment,
        });
      };
      img.onerror = () => {
        throw new Error("Failed to load image for processing.");
      };
    } catch (err) {
      console.error('Error during detection:', err);
      setError(`Detection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/Home'); // Navigate back to the Home page
  };

  const handleViewSolution = () =>{
    if (detectionResult && detectionResult.disease !== 'Healthy'){
        navigate('/DiseaseSolution',{
          state:{
            crop: selectedCrop,
            disease: detectionResult.disease,
          }
        });
    } else if (detectionResult && detectionResult.disease == 'Healthy'){
      alert("Your crop is healthy! No specific treatment plan needed.");
    } else{
      alert("Please detect a disease first");
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700">
          Disease Detection for <span className="text-blue-600">{selectedCrop}</span>
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Upload an image of your {selectedCrop} plant for disease analysis.
        </p>

        {modelLoading && (
          <div className="text-center text-blue-600 mb-4">Loading model... This might take a moment.</div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-4 p-2 border border-red-300 bg-red-50 rounded-md">
            Error: {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Image:
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            disabled={modelLoading}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-100"
          />
        </div>

        {imagePreview && (
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Image Preview:</h3>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        <button
          onClick={handleDetectDisease}
          disabled={!selectedImage || loading || modelLoading || error}
          className={`w-full p-3 rounded-lg text-white font-semibold text-lg transition mb-4 ${
            (selectedImage && !loading && !modelLoading && !error) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Detecting...' : 'Detect Disease'}
        </button>

        {detectionResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <h3 className="text-xl font-bold text-green-800 mb-2">Detection Result:</h3>
            <p className="text-gray-800">
              <span className="font-semibold">Disease:</span> {detectionResult.disease}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Confidence:</span> {detectionResult.confidence}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Symptoms:</span> {detectionResult.symptoms}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Treatment:</span> {detectionResult.treatment}
            </p>
            {detectionResult.disease !== 'Healthy' && (
              <button
                onClick={handleViewSolution}
                className="mt-4 w-full p-2 rounded-lg bg-purple-600 text-white font-semibold text-md hover:bg-purple-700 transition"
              >
                View Treatment Plan
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleBackToHome}
          className="mt-6 w-full p-3 rounded-lg bg-gray-300 text-gray-800 font-semibold text-lg hover:bg-gray-400 transition"
        >
          Back to Crop Selection
        </button>
      </div>
    </div>
  );
}

export default DiseaseDetection;
