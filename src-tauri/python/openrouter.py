import requests
import json

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": "Hey"
            }
        ],
    })
)

# Parse the JSON response
response_data = response.json()

# Print individual fields
# print("ID:", response_data.get("id"))
# print("Provider:", response_data.get("provider"))
print("Model:", response_data.get("model"))
# print("Created:", response_data.get("created"))

# Access nested fields
choices = response_data.get("choices", [])
if choices:
    message = choices[0].get("message", {})
    # print("Reasoning:", message.get("reasoning"))
    print("Assistant Message:", message.get("content"))