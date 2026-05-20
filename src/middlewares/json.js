
export async function withJSON(req, res) {

  // Parsing the input
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers)?.toString())
  } catch (error) {
    req.body = null
  }

  // Set the output content type
  res.setHeader("Content-Type", "application/json");
}