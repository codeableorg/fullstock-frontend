import { GoogleGenAI } from "@google/genai";
import { getGoogleApiKey } from "@/config/google-ai";
import { getAllCategories } from "./category.service";
import { getAllProducts } from "./product.service";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class ChatService {
  private ai!: GoogleGenAI;
  private chat: any;
  private categoriesData: any[] = [];
  private productsData: any[] = [];
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private static instance: ChatService | null = null;

  constructor() {
    console.log("🔧 ChatService: Constructor iniciado");

    // Check if this is a singleton pattern issue
    if (ChatService.instance) {
      console.log(
        "⚠️ ChatService: Ya existe una instancia, usando la existente"
      );
      return ChatService.instance;
    }

    const apiKey = getGoogleApiKey();
    console.log(
      "🔑 ChatService: API Key obtenida:",
      apiKey ? "✅ Presente" : "❌ Faltante"
    );

    try {
      this.ai = new GoogleGenAI({
        apiKey: apiKey,
      });
      console.log("🤖 ChatService: GoogleGenAI inicializado correctamente");
    } catch (error) {
      console.error("❌ ChatService: Error inicializando GoogleGenAI:", error);
      throw error;
    }

    // Start initialization but don't wait for it in constructor
    console.log("🚀 ChatService: Iniciando carga de datos...");
    this.initializationPromise = this.loadDataAndInitialize();

    ChatService.instance = this;
    console.log("🆕 ChatService: Nueva instancia creada y guardada");
  }

  // Add method to check initialization status
  public getInitializationStatus(): {
    isInitialized: boolean;
    hasChat: boolean;
    hasAI: boolean;
    categoriesCount: number;
    productsCount: number;
  } {
    const status = {
      isInitialized: this.isInitialized,
      hasChat: !!this.chat,
      hasAI: !!this.ai,
      categoriesCount: this.categoriesData.length,
      productsCount: this.productsData.length,
    };

    console.log("📊 ChatService: Status actual:", status);
    return status;
  }

  // Add method to force initialization for debugging
  public async forceInitialization(): Promise<void> {
    console.log("🔄 ChatService: Forzando inicialización...");
    this.isInitialized = false;
    this.initializationPromise = this.loadDataAndInitialize();
    await this.initializationPromise;
    console.log("✅ ChatService: Inicialización forzada completada");
  }

  private async loadDataAndInitialize() {
    console.log("📊 ChatService: Cargando datos de categorías y productos...");

    try {
      // Add timeout to avoid hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout loading data")), 10000)
      );

      const dataPromise = Promise.all([getAllCategories(), getAllProducts()]);

      const [categoriesResponse, productsResponse] = (await Promise.race([
        dataPromise,
        timeoutPromise,
      ])) as any[];

      console.log(
        "📁 ChatService: Categorías cargadas:",
        categoriesResponse?.length || 0
      );
      console.log(
        "🛍️ ChatService: Productos cargados:",
        productsResponse?.length || 0
      );

      this.categoriesData = categoriesResponse || [];
      this.productsData = productsResponse || [];
    } catch (error) {
      console.error("⚠️ ChatService: Error cargando datos:", error);
      // Continue with default data if services fail
      this.categoriesData = [];
      this.productsData = [];
    }

    console.log("🔄 ChatService: Inicializando chat...");
    try {
      this.initializeChat();
      console.log("✅ ChatService: Chat inicializado correctamente");
    } catch (error) {
      console.error("❌ ChatService: Error inicializando chat:", error);
      throw error;
    }

    this.isInitialized = true;
    console.log("🎉 ChatService: Inicialización completa");
  }

  private initializeChat() {
    console.log("🔨 ChatService: Construyendo prompt del sistema...");

    // Build dynamic product information
    const categoriesInfo =
      this.categoriesData.length > 0
        ? this.categoriesData
            .map(
              (cat) =>
                `- ${cat.name}: ${
                  cat.description || "Productos de alta calidad"
                }`
            )
            .join("\n")
        : `- Polos: Ropa personalizada de alta calidad
- Tazas: Tazas personalizadas para diferentes ocasiones
- Stickers: Adhesivos personalizados y creativos`;

    const productsInfo =
      this.productsData.length > 0
        ? this.productsData
            .slice(0, 10)
            .map(
              (product) =>
                `- ${product.name}: $${product.price} - ${
                  product.description || "Producto disponible"
                }`
            )
            .join("\n")
        : "Consulta nuestro catálogo completo de productos personalizados.";

    const systemPrompt = `Eres un asistente virtual de FullStock, una tienda online que vende productos personalizados como polos, tazas y stickers.

Tu objetivo es ayudar a los clientes con:
- Información sobre productos (polos, tazas, stickers)
- Proceso de compra y checkout
- Preguntas sobre envíos y devoluciones
- Recomendaciones de productos
- Soporte general

CATEGORÍAS DISPONIBLES:
${categoriesInfo}

PRODUCTOS DESTACADOS:
${productsInfo}

Mantén un tono amigable y profesional. Si no puedes ayudar con algo específico, deriva al cliente al soporte humano.

Responde de manera concisa y útil.`;

    console.log(
      "📝 ChatService: Prompt generado. Longitud:",
      systemPrompt.length
    );
    console.log(
      "📝 ChatService: Categorías info:",
      categoriesInfo.substring(0, 100) + "..."
    );
    console.log(
      "📝 ChatService: Productos info:",
      productsInfo.substring(0, 100) + "..."
    );

    try {
      console.log(
        "🔗 ChatService: Creando chat con modelo gemini-2.5-flash..."
      );

      // Updated API structure for Google GenAI
      this.chat = this.ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [
              {
                text: "¡Hola! Soy el asistente virtual de FullStock. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros productos, proceso de compra, o cualquier otra consulta. ¿En qué puedo ayudarte hoy?",
              },
            ],
          },
        ],
      });

      console.log("✅ ChatService: Chat creado exitosamente");
    } catch (error) {
      console.error("❌ ChatService: Error creando chat:", error);
      console.error("❌ ChatService: Detalles del error:", {
        error,
      });
      throw error;
    }
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    console.log(
      "💬 ChatService: Enviando mensaje:",
      message.substring(0, 50) + "..."
    );
    console.log(
      "🔍 ChatService: Estado antes de enviar:",
      this.getInitializationStatus()
    );

    try {
      // Wait for initialization to complete
      if (!this.isInitialized && this.initializationPromise) {
        console.log("⏳ ChatService: Esperando inicialización...");
        await this.initializationPromise;
        console.log("✅ ChatService: Inicialización completada");
      }

      if (!this.chat) {
        console.error("❌ ChatService: Chat no inicializado");
        console.log(
          "🔍 ChatService: Estado final:",
          this.getInitializationStatus()
        );
        throw new Error("Chat not properly initialized");
      }

      console.log("📤 ChatService: Enviando mensaje a Gemini...");

      // Add different API call methods to test
      let result;
      try {
        result = await this.chat.sendMessage(message);
      } catch (apiError) {
        console.error(
          "❌ ChatService: Error con sendMessage, intentando sendMessageStream:",
          apiError
        );
        // Try alternative method
        result = await this.chat.sendMessage({ message: message });
      }

      console.log("📥 ChatService: Respuesta recibida de Gemini");

      const response = await result.response;
      const responseText = response.text();

      console.log("✅ ChatService: Mensaje procesado exitosamente");
      console.log(
        "📝 ChatService: Respuesta:",
        responseText.substring(0, 100) + "..."
      );

      return {
        success: true,
        message: responseText,
      };
    } catch (error) {
      console.error("❌ ChatService: Error enviando mensaje:", error);
      console.error("❌ ChatService: Detalles completos:", {
        error,
        isInitialized: this.isInitialized,
        chatExists: !!this.chat,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  async resetChat() {
    console.log("🔄 ChatService: Reiniciando chat...");
    this.isInitialized = false;
    this.initializationPromise = this.loadDataAndInitialize();
    await this.initializationPromise;
    console.log("✅ ChatService: Chat reiniciado");
  }
}
