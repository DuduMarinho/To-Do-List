import createApp from './app';
import connectDatabase from './config/database';
import getEnvConfig from './config/env';

const env = getEnvConfig();

const startServer = async (): Promise<void> => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();

    // Criar aplicação Express
    const app = createApp();

    // Iniciar servidor
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
      console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
      console.log(`📱 Frontend URL: ${env.FRONTEND_URL}`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n⏳ Iniciando shutdown graceful...');
      server.close(() => {
        console.log('✅ Servidor HTTP fechado');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer(); 