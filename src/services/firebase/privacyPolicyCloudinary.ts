import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { uploadPDF } from '@/config/cloudinary';
import { logger } from '@/services/loggerService';

export interface PrivacyPolicyDocument {
  id: string;
  fileName: string;
  downloadUrl: string;
  publicId: string;
  uploadedAt: any;
  uploadedBy: string;
  fileSize: number;
}

const COLLECTION_NAME = 'privacyPolicy';
const DOCUMENT_ID = 'current';

class PrivacyPolicyCloudinary {
  async getCurrentPolicy(): Promise<PrivacyPolicyDocument | null> {
    try {
      logger.info('Obteniendo política de privacidad actual', 'privacyPolicyCloudinary');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as PrivacyPolicyDocument;
        logger.info('Política de privacidad encontrada', 'privacyPolicyCloudinary', { fileName: data.fileName });
        return data;
      }
      
      logger.info('No se encontró política de privacidad', 'privacyPolicyCloudinary');
      return null;
    } catch (error) {
      logger.error('Error al obtener política de privacidad', 'privacyPolicyCloudinary', error);
      throw error;
    }
  }

  async uploadPolicy(
    file: File, 
    uploadedBy: string
  ): Promise<PrivacyPolicyDocument> {
    try {
      logger.info('Iniciando subida de política de privacidad a Cloudinary', 'privacyPolicyCloudinary', { 
        fileName: file.name, 
        fileSize: file.size,
        uploadedBy 
      });

      if (file.type !== 'application/pdf') {
        throw new Error('El archivo debe ser un PDF');
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo no puede ser mayor a 10MB');
      }

      await this.deleteCurrentPolicy();

      logger.info('Subiendo archivo a Cloudinary', 'privacyPolicyCloudinary');
      const cloudinaryResponse = await uploadPDF(file);

      const downloadUrl = cloudinaryResponse.secure_url;

      const policyDoc: PrivacyPolicyDocument = {
        id: DOCUMENT_ID,
        fileName: file.name,
        downloadUrl: downloadUrl,
        publicId: cloudinaryResponse.public_id,
        uploadedAt: serverTimestamp(),
        uploadedBy,
        fileSize: file.size
      };

      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(docRef, policyDoc);

      logger.info('Política de privacidad subida exitosamente a Cloudinary', 'privacyPolicyCloudinary', { 
        fileName: file.name,
        downloadUrl: downloadUrl,
        publicId: cloudinaryResponse.public_id,
        originalUrl: cloudinaryResponse.secure_url
      });

      return {
        ...policyDoc,
        uploadedAt: new Date()
      };
    } catch (error) {
      logger.error('Error al subir política de privacidad a Cloudinary', 'privacyPolicyCloudinary', error);
      throw error;
    }
  }

  async deleteCurrentPolicy(): Promise<void> {
    try {
      logger.info('Eliminando política de privacidad actual', 'privacyPolicyCloudinary');

      const currentPolicy = await this.getCurrentPolicy();
      
      if (currentPolicy) {
        logger.info('Eliminando documento de Firestore', 'privacyPolicyCloudinary', {
          publicId: currentPolicy.publicId
        });

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await deleteDoc(docRef);
        
        logger.info('Política de privacidad eliminada exitosamente', 'privacyPolicyCloudinary');
      } else {
        logger.info('No hay política de privacidad para eliminar', 'privacyPolicyCloudinary');
      }
    } catch (error) {
      logger.error('Error al eliminar política de privacidad', 'privacyPolicyCloudinary', error);
      throw error;
    }
  }

  async downloadPolicy(): Promise<string | null> {
    try {
      const currentPolicy = await this.getCurrentPolicy();
      
      if (currentPolicy) {
        logger.info('Iniciando descarga de política de privacidad', 'privacyPolicyCloudinary');
        return currentPolicy.downloadUrl;
      }
      
      logger.warn('No hay política de privacidad disponible para descargar', 'privacyPolicyCloudinary');
      return null;
    } catch (error) {
      logger.error('Error al obtener URL de descarga', 'privacyPolicyCloudinary', error);
      throw error;
    }
  }

  async hasPolicy(): Promise<boolean> {
    try {
      const policy = await this.getCurrentPolicy();
      return policy !== null;
    } catch (error) {
      logger.error('Error al verificar existencia de política', 'privacyPolicyCloudinary', error);
      return false;
    }
  }
}

export const privacyPolicyCloudinary = new PrivacyPolicyCloudinary();
