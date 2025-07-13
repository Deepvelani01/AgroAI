import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css'; // For general styling

function DiseaseSolution() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract crop and disease from the navigation state
  const { crop, disease } = location.state || { crop: 'Unknown', disease: 'Unknown' };

  // Hardcoded solutions based on disease name
  // In a real application, this data would likely come from an API or a more robust knowledge base
  const solutionsData = {
    'Anthracnose': {
      title: 'Anthracnose Treatment Plan',
      description: 'Anthracnose is a common fungal disease affecting many crops, including Mango. It causes black, sunken lesions on leaves, stems, flowers, and fruits.',
      steps: [
        '**Fungicide Application:** Apply fungicides containing copper or mancozeb. Follow label instructions for dosage and frequency.',
        '**Pruning:** Remove and destroy infected branches, twigs, and fruits to reduce inoculum.',
        '**Sanitation:** Collect and dispose of fallen leaves and fruits to prevent disease spread.',
        '**Improve Air Circulation:** Prune trees to allow better air movement, which reduces humidity and fungal growth.',
        '**Proper Irrigation:** Avoid overhead irrigation, which can spread spores. Water at the base of the plant.',
        '**Resistant Varieties:** Consider planting disease-resistant varieties if available for future crops.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Anthracnose+Solution' // Placeholder image
    },
    'Bacterial Canker': {
      title: 'Bacterial Canker Management',
      description: 'Bacterial canker is caused by bacteria and leads to water-soaked spots, cankers on branches, and fruit blemishes.',
      steps: [
        '**Copper Sprays:** Apply copper-based bactericides during dormant periods and early growth stages.',
        '**Pruning:** Remove infected branches and cankers during dry weather to prevent spread. Disinfect tools.',
        '**Wound Protection:** Protect pruning wounds with a sealant.',
        '**Good Drainage:** Ensure good soil drainage to reduce stress on plants.',
        '**Resistant Cultivars:** Choose resistant varieties where possible.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Bacterial+Canker+Solution'
    },
    'Cutting Weevil': {
      title: 'Cutting Weevil Control',
      description: 'Cutting weevils cut circular pieces from leaves, often causing leaves to roll or fold.',
      steps: [
        '**Manual Removal:** Hand-pick weevils and destroy them, especially in small orchards.',
        '**Insecticide Application:** Use recommended insecticides if infestation is severe. Consult local agricultural extension for specific product recommendations.',
        '**Trap Cropping:** Plant attractive crops nearby to lure weevils away from main crop.',
        '**Good Field Hygiene:** Remove crop residues where weevils might overwinter.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Cutting+Weevil+Solution'
    },
    'Die Back': {
      title: 'Die Back Disease Management',
      description: 'Die back is characterized by the progressive death of shoots, twigs, and branches starting from the tips.',
      steps: [
        '**Pruning:** Prune back affected branches to healthy wood. Disinfect pruning tools between cuts.',
        '**Improve Drainage:** Ensure good soil drainage to prevent waterlogging, which stresses plants.',
        '**Balanced Fertilization:** Provide adequate and balanced nutrients to improve plant vigor.',
        '**Fungicide Application:** In some cases, fungicides may be recommended, especially if a specific fungal pathogen is identified.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Die+Back+Solution'
    },
    'Gall Midge': {
      title: 'Gall Midge Control Strategies',
      description: 'Gall midges cause abnormal growths (galls) on plant parts, affecting growth and yield.',
      steps: [
        '**Remove Galls:** Manually remove and destroy galls to prevent adult emergence.',
        '**Systemic Insecticides:** Apply systemic insecticides that are absorbed by the plant and kill feeding larvae.',
        '**Biological Control:** Encourage natural enemies like parasitic wasps.',
        '**Crop Rotation:** Rotate crops to break the life cycle of the pest.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Gall+Midge+Solution'
    },
    'Powdery Mildew': {
      title: 'Powdery Mildew Treatment',
      description: 'Powdery mildew appears as white, powdery spots on leaves and stems, leading to distorted growth.',
      steps: [
        '**Fungicide Sprays:** Apply fungicides like sulfur, potassium bicarbonate, or specific systemic fungicides.',
        '**Improve Air Circulation:** Proper plant spacing and pruning can help reduce humidity.',
        '**Watering:** Water at the base of the plant to keep foliage dry.',
        '**Resistant Varieties:** Plant varieties known for resistance to powdery mildew.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Powdery+Mildew+Solution'
    },
    'Scab': {
      title: 'Scab Disease Management',
      description: 'Scab causes rough, corky lesions on fruits, leaves, and twigs, reducing marketability.',
      steps: [
        '**Fungicide Program:** Implement a regular fungicide spray program, especially during wet periods.',
        '**Resistant Varieties:** Choose scab-resistant cultivars.',
        '**Sanitation:** Remove and destroy infected plant debris to reduce overwintering spores.',
        '**Pruning:** Prune to improve air circulation and sunlight penetration.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Scab+Solution'
    },
    'Tracin': {
      title: 'Tracin (General Deficiency) Management',
      description: 'Tracin is a general term indicating nutrient deficiencies or environmental stress, leading to yellowing and stunted growth.',
      steps: [
        '**Soil Testing:** Conduct a soil test to identify specific nutrient deficiencies.',
        '**Balanced Fertilization:** Apply fertilizers based on soil test recommendations.',
        '**Proper Irrigation:** Ensure consistent and adequate water supply, avoiding both drought and waterlogging.',
        '**Improve Soil Health:** Incorporate organic matter to improve soil structure and nutrient retention.',
        '**Pest/Disease Check:** Rule out underlying pest or disease issues that might mimic deficiency symptoms.'
      ],
      image: 'https://placehold.co/400x200/ADD8E6/000000?text=Tracin+Solution'
    },
    'Healthy': {
      title: 'Your Crop is Healthy!',
      description: 'Great news! Your crop appears to be healthy. Continue with good agricultural practices to maintain its vigor.',
      steps: [
        '**Regular Monitoring:** Keep an eye on your plants for any early signs of stress or disease.',
        '**Optimal Nutrition:** Ensure balanced fertilization based on soil tests.',
        '**Proper Watering:** Provide adequate water, avoiding over or under-watering.',
        '**Pest Management:** Implement integrated pest management strategies to prevent infestations.',
        '**Good Sanitation:** Keep the growing area clean to minimize disease vectors.'
      ],
      image: 'https://placehold.co/400x200/90EE90/000000?text=Healthy+Crop'
    },
    // Default solution if disease not found or handled
    'Unknown': {
      title: 'Solution Not Found',
      description: 'We could not find specific solution details for this disease. Please consult with a local agricultural expert or extension office for tailored advice.',
      steps: [
        'Provide detailed information about your crop and symptoms to an expert.',
        'Consider re-uploading a clearer image for detection.',
        'Monitor the plant closely for any changes.'
      ],
      image: 'https://placehold.co/400x200/FFDDC1/000000?text=Solution+Not+Found'
    }
  };

  const solution = solutionsData[disease] || solutionsData['Unknown'];

  const handleBackToDetection = () => {
    // Navigate back to the DiseaseDetection page
    // You might want to pass back the crop and image if you want to retain state
    navigate('/DiseaseDetection', { state: { crop: crop } });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700">
          Treatment Plan for <span className="text-blue-600">{crop}</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Disease: <span className="text-red-600">{disease}</span>
        </h2>

        {solution.image && (
          <div className="mb-6 text-center">
            <img
              src={solution.image}
              alt={solution.title}
              className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}

        <p className="mb-4 text-gray-700 leading-relaxed">{solution.description}</p>

        <h3 className="text-xl font-bold text-green-800 mb-3">Recommended Steps:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {solution.steps.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ul>

        <button
          onClick={handleBackToDetection}
          className="mt-8 w-full p-3 rounded-lg bg-gray-300 text-gray-800 font-semibold text-lg hover:bg-gray-400 transition"
        >
          Back to Detection
        </button>
      </div>
    </div>
  );
}

export default DiseaseSolution;
