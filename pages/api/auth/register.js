export default function handler(req, res) {
  const {
    query: { email, password, firstName, lastName },
    method,
  } = req;

  if (req.method === "POST") {
    //create firebase user
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
