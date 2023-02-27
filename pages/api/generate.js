import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Give me ten interesting facts about this animal.

Animal: Cat
Facts: Cats have retractable claws, which they use for hunting, climbing, and self-defense. When they are not using their claws, they keep them retracted to keep them sharp.

A group of cats is called a clowder, while a group of kittens is called a litter.

Cats are crepuscular, which means they are most active during dawn and dusk.

The world's oldest cat, Creme Puff, lived to be 38 years and 3 days old.

Cats have an extra organ called the Jacobson's organ that allows them to taste smells. When a cat makes a funny face and opens its mouth, it's called the Flehmen response, and it's using this organ to analyze a smell.

Cats have powerful night vision, which allows them to see in low light conditions.

There are over 100 different breeds of cats, with different appearances and personalities.

In ancient Egypt, cats were considered sacred animals and were worshiped as gods.

A cat's purr is not just a sign of contentment; it can also be a self-soothing mechanism that helps them calm down when they are stressed or in pain.

Cats have flexible spines, which allow them to squeeze through narrow spaces and contort their bodies into different positions.
Animal: Dog
Facts: Dogs can hear sounds that are much higher in frequency than what humans can hear. They also have a sense of hearing that is four times better than ours.

A dog's sense of smell is up to 100,000 times better than a human's. That's why they are often used for search and rescue missions and detecting drugs or explosives.

The world's smallest dog breed is the Chihuahua, while the tallest is the Great Dane.

Dogs have a unique gland located in their rectums called the anal glands. These glands secrete a distinctive odor that helps dogs identify each other.

The Basenji dog breed is unique in that it doesn't bark. Instead, they make a sound that is similar to a yodel.

Dogs have three eyelids. The third eyelid, called the nictitating membrane, helps keep the eye moist and protected.

The world's oldest dog on record was an Australian Cattle Dog named Bluey who lived to be 29 years and 5 months old.

A dog's nose print is as unique as a human's fingerprint and can be used to identify individual dogs.

Dogs are capable of understanding and responding to human body language and vocal intonation.

The Soviet Union once trained dogs to be suicide bombers by strapping bombs to their bodies and sending them towards enemy targets. However, this program was unsuccessful and was eventually abandoned.
Animal: ${capitalizedAnimal}
facts:`;
}
