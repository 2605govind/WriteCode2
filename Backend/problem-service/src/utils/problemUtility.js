import axios from "axios";
import 'dotenv/config';


const getLanguageById = (lang) => {
  const language = {
    "cpp": 54,
    "java": 62,
    "javascript": 63
  }
  return language[lang.toLowerCase()];
}


const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("Error at submitBatch", error)
      console.log(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }

  return await fetchData();
}



const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
}


const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      // console.error(error);
      console.log("Error at submitToken")
    }
  }


  while (true) {
    const result = await fetchData();
    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (IsResultObtained)
      return result.submissions;

    await waiting(1000);
  }
}

export { getLanguageById, submitBatch, submitToken };