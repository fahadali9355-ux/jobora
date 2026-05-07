import os
import json
import boto3

MODEL_ID = "eu.anthropic.claude-haiku-4-5-20251001-v1:0"

def get_bedrock_client():
    """
    Initializes and returns the Amazon Bedrock Runtime client.
    Uses credentials from environment variables automatically if present.
    """
    return boto3.client(
        service_name='bedrock-runtime',
        region_name=os.getenv('AWS_DEFAULT_REGION', 'eu-north-1')
    )

def invoke_claude(prompt_text: str, max_tokens: int = 1000) -> str:
    """
    Invokes Anthropic Claude 3 via Amazon Bedrock.
    
    Args:
        prompt_text: The user input prompt.
        max_tokens: Maximum tokens for the response.
        
    Returns:
        The generated text response.
    """
    client = get_bedrock_client()
    
    # Format the payload for Claude 3 Messages API format
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt_text}]
            }
        ]
    }
    
    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(payload),
            contentType="application/json",
            accept="application/json"
        )
        
        response_body = json.loads(response.get("body").read())
        
        # Extract the text from the response
        if "content" in response_body and len(response_body["content"]) > 0:
            return response_body["content"][0]["text"]
            
        return ""
        
    except Exception as e:
        print(f"Error invoking Claude via Bedrock: {e}")
        return str(e)
