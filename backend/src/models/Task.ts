import mongoose, { Document, Schema } from 'mongoose';

export enum TaskPriority {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

export enum TaskStatus {
  PENDENTE = 'pendente',
  CONCLUIDO = 'concluido'
}

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [50, 'Título deve ter no máximo 50 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Descrição deve ter no máximo 200 caracteres']
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIA,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDENTE,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task; 