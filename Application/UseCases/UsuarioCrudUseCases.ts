import type { Usuario, UsuarioCreateInput } from '../../Domain/Entities/Usuario';
import type { IUsuarioRepository } from '../../Domain/Ports/IUsuarioRepository';

export class CreateUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  execute(input: UsuarioCreateInput): Promise<Usuario> {
    return this.usuarioRepository.create(input);
  }
}

export class GetUsuariosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  execute(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }
}

export class GetUsuarioByIdUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  execute(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }
}

export class UpdateUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  execute(usuario: Usuario): Promise<void> {
    return this.usuarioRepository.update(usuario);
  }
}

export class DeleteUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  execute(id: number): Promise<void> {
    return this.usuarioRepository.delete(id);
  }
}
