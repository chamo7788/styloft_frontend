// Main index file for styleStudio components

// Core components
import ModelEditor from './ModelEditor';
import ModelViewer from './ModelViewer';
import Model from './Model';
import ControlPanel from './ControlPanel';
import Toolbar from './Toolbar';
import TabPanel from './TabPanel';
import LayerManager from './LayerManager';
import UserGuide from './UserGuide';

// Selection components
import ModelSelector from './ModelSelector';
import PartSelector from './PartSelector';
import ColorPicker from './ColorPicker';
import FileUploader from './FileUploader';

// Feature components
import LightingControls from './LightingControls';
import PatternGenerator from './PatternGenerator';
import MaterialSimulation from './MaterialSimulation';
import ColorPaletteSuggestions from './ColorPaletteSuggestions';
import DesignTemplates from './DesignTemplates';

// AI-powered components
import AILogoGenerator from './AILogoGenerator';
import AITextureGenerator from './AITextureGenerator';

// Texture editing components
import {
  TextureEditor,
  EditorToolbar,
  CanvasEditor,
  BrushControls,
  TextControls,
  LogoControls,
  useCanvasHistory,
  useLogoManipulation,
} from './texture-editor';

export {
  // Core components
  ModelEditor,
  ModelViewer,
  Model,
  ControlPanel,
  Toolbar,
  TabPanel,
  LayerManager,
  UserGuide,
  
  // Selection components
  ModelSelector,
  PartSelector,
  ColorPicker,
  FileUploader,
  
  // Feature components
  LightingControls,
  PatternGenerator,
  MaterialSimulation,
  ColorPaletteSuggestions,
  DesignTemplates,
  
  // AI-powered components
  AILogoGenerator,
  AITextureGenerator,
  
  // Texture editing components
  TextureEditor,
  EditorToolbar,
  CanvasEditor,
  BrushControls,
  TextControls,
  LogoControls,
  useCanvasHistory,
  useLogoManipulation,
};

// Default export for simpler imports
export default ModelEditor;