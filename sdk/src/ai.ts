import axios, { AxiosInstance } from 'axios';
import { 
  AIModel, 
  AIModelMetadata, 
  BlockData, 
  AIProof,
  PredictionResult
} from './types';

/**
 * AI client for HyperNova Chain
 */
export class AIClient {
  private readonly api: AxiosInstance;

  /**
   * Create a new AI client
   * @param apiUrl AI API URL
   */
  constructor(apiUrl: string = 'http://localhost:8000') {
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * List available AI models
   * @param owner Filter by owner
   * @param tag Filter by tag
   * @returns List of models
   */
  async listModels(owner?: string, tag?: string): Promise<AIModel[]> {
    const params: any = {};
    
    if (owner) {
      params.owner = owner;
    }
    
    if (tag) {
      params.tag = tag;
    }
    
    const response = await this.api.get('/models/list', { params });
    return response.data.models;
  }

  /**
   * Get model details
   * @param modelId Model ID
   * @returns Model details
   */
  async getModel(modelId: string): Promise<AIModel> {
    const response = await this.api.get(`/models/${modelId}`);
    return response.data;
  }

  /**
   * Register a new AI model
   * @param file Model file
   * @param metadata Model metadata
   * @returns Model ID
   */
  async registerModel(file: File, metadata: AIModelMetadata): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', metadata.name);
    formData.append('description', metadata.description);
    formData.append('owner', metadata.owner);
    formData.append('model_type', metadata.model_type);
    formData.append('tags', JSON.stringify(metadata.tags || []));
    
    const response = await this.api.post('/models/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.model_id;
  }

  /**
   * Delete a model
   * @param modelId Model ID
   * @param owner Owner address
   * @returns Success status
   */
  async deleteModel(modelId: string, owner: string): Promise<boolean> {
    const response = await this.api.delete(`/models/${modelId}`, {
      params: { owner },
    });
    
    return response.data.success;
  }

  /**
   * Make predictions using a model
   * @param modelId Model ID
   * @param inputData Input data
   * @param userAddress User address
   * @returns Prediction results
   */
  async predict(modelId: string, inputData: any[], userAddress?: string): Promise<PredictionResult> {
    const response = await this.api.post('/models/predict', {
      model_id: modelId,
      input_data: inputData,
      user_address: userAddress,
    });
    
    return response.data;
  }

  /**
   * Generate an AI proof for a block
   * @param blockData Block data
   * @param modelId Model ID (optional)
   * @returns AI proof
   */
  async generateProof(blockData: BlockData, modelId?: string): Promise<AIProof> {
    const response = await this.api.post('/consensus/generate_proof', {
      block_data: blockData,
      model_id: modelId,
    });
    
    return response.data;
  }

  /**
   * Verify an AI proof for a block
   * @param blockData Block data
   * @param proof AI proof
   * @returns Verification result
   */
  async verifyProof(blockData: BlockData, proof: AIProof): Promise<boolean> {
    const response = await this.api.post('/consensus/verify_proof', {
      block_data: blockData,
      proof,
    });
    
    return response.data.is_valid;
  }
}