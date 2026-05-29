<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [
            // Login y Sesión
            ['test_type_id' => 1, 'name' => 'Login correcto', 'description' => 'Usuario y contraseña válidos', 'expected_result' => 'Entra a la app y carga grupos'],
            ['test_type_id' => 1, 'name' => 'Login incorrecto', 'description' => 'Credenciales inválidas', 'expected_result' => 'Muestra error claro'],
            ['test_type_id' => 1, 'name' => 'Token vencido', 'description' => 'Sesión expirada', 'expected_result' => 'Redirige a login o refresca sesión correctamente'],
            ['test_type_id' => 1, 'name' => 'Logout', 'description' => 'Cerrar sesión', 'expected_result' => 'Limpia sesión local y vuelve al login'],
            ['test_type_id' => 1, 'name' => 'App reiniciada', 'description' => 'Abrir app después de cerrar', 'expected_result' => 'Mantiene sesión si el token sigue válido'],

            // Grupos y Salas
            ['test_type_id' => 2, 'name' => 'Usuario con grupos asignados', 'description' => 'Abrir pantalla principal', 'expected_result' => 'Lista solo sus grupos'],
            ['test_type_id' => 2, 'name' => 'Usuario sin grupos', 'description' => 'Abrir pantalla principal', 'expected_result' => 'Mensaje claro: sin grupos asignados'],
            ['test_type_id' => 2, 'name' => 'Activar escucha en grupo', 'description' => 'Encender Escuchar', 'expected_result' => 'Se conecta correctamente a la sala'],
            ['test_type_id' => 2, 'name' => 'Desactivar escucha', 'description' => 'Apagar Escuchar', 'expected_result' => 'Se desconecta o deja de recibir audio'],
            ['test_type_id' => 2, 'name' => 'Cambiar sala TX', 'description' => 'Seleccionar otro grupo para hablar', 'expected_result' => 'El PTT transmite solo en la sala activa'],
            ['test_type_id' => 2, 'name' => 'Grupo no autorizado', 'description' => 'Intentar entrar a grupo no asignado', 'expected_result' => 'Backend rechaza'],

            // PTT Half-Duplex
            ['test_type_id' => 3, 'name' => 'Usuario A presiona PTT', 'description' => 'A habla en sala', 'expected_result' => 'Los demás escuchan'],
            ['test_type_id' => 3, 'name' => 'Usuario B intenta hablar mientras A habla', 'description' => 'B presiona PTT', 'expected_result' => 'Debe recibir ocupado / denegado'],
            ['test_type_id' => 3, 'name' => 'Usuario A suelta PTT', 'description' => 'Finaliza transmisión', 'expected_result' => 'Otro usuario puede hablar'],
            ['test_type_id' => 3, 'name' => 'PTT sin sala activa', 'description' => 'Presionar PTT', 'expected_result' => 'No debe transmitir'],
            ['test_type_id' => 3, 'name' => 'PTT en sala no conectada', 'description' => 'Presionar PTT', 'expected_result' => 'Debe bloquear transmisión'],
            ['test_type_id' => 3, 'name' => 'PTT rápido repetido', 'description' => 'Presionar/soltar varias veces', 'expected_result' => 'No debe quedar lock pegado'],
            ['test_type_id' => 3, 'name' => 'PTT mantenido mucho tiempo', 'description' => 'Mantener presionado', 'expected_result' => 'Debe renovar lock correctamente'],

            // Audio
            ['test_type_id' => 4, 'name' => 'Audio normal', 'description' => 'Hablar por PTT', 'expected_result' => 'Audio entendible'],
            ['test_type_id' => 4, 'name' => 'Inicio de audio', 'description' => 'Presionar y hablar inmediatamente', 'expected_result' => 'No debe cortar la primera palabra'],
            ['test_type_id' => 4, 'name' => 'Final de audio', 'description' => 'Soltar PTT', 'expected_result' => 'Debe cortar transmisión sin eco prolongado'],
            ['test_type_id' => 4, 'name' => 'Silencio', 'description' => 'Presionar sin hablar', 'expected_result' => 'No debe generar ruido excesivo'],
            ['test_type_id' => 4, 'name' => 'Micrófono denegado', 'description' => 'Quitar permiso de micrófono', 'expected_result' => 'App debe pedir permiso o bloquear PTT'],

            // Botón Físico
            ['test_type_id' => 5, 'name' => 'Pulsar botón físico', 'description' => 'Pulsar botón PTT', 'expected_result' => 'Inicia PTT'],
            ['test_type_id' => 5, 'name' => 'Soltar botón físico', 'description' => 'Soltar botón PTT', 'expected_result' => 'Detiene PTT'],
            ['test_type_id' => 5, 'name' => 'Pulsaciones rápidas', 'description' => 'Pulsar/soltar rápido', 'expected_result' => 'No duplica eventos'],
            ['test_type_id' => 5, 'name' => 'Mantener presionado', 'description' => 'Botón presionado largo tiempo', 'expected_result' => 'Mantiene transmisión'],
            ['test_type_id' => 5, 'name' => 'Botón sin sala TX', 'description' => 'Presionar sin sala activa', 'expected_result' => 'No transmite'],
            ['test_type_id' => 5, 'name' => 'Botón cuando otro habla', 'description' => 'Presionar mientras otro transmite', 'expected_result' => 'Muestra ocupado o tono de bloqueo'],

            // Red
            ['test_type_id' => 6, 'name' => 'WiFi estable', 'description' => 'Usar PTT normal', 'expected_result' => 'Audio estable'],
            ['test_type_id' => 6, 'name' => 'Datos móviles LTE', 'description' => 'Usar PTT normal', 'expected_result' => 'Audio estable'],
            ['test_type_id' => 6, 'name' => 'Cambio WiFi a datos', 'description' => 'Cambiar red durante escucha', 'expected_result' => 'Se reconecta o maneja error'],
            ['test_type_id' => 6, 'name' => 'Sin Internet', 'description' => 'Abrir app sin red', 'expected_result' => 'Muestra estado offline'],
            ['test_type_id' => 6, 'name' => 'Internet vuelve', 'description' => 'Restaurar red', 'expected_result' => 'Reintenta conexión'],
            ['test_type_id' => 6, 'name' => 'Pérdida durante TX', 'description' => 'Cortar Internet hablando', 'expected_result' => 'Detiene transmisión y libera lock'],

            // GPS Consola
            ['test_type_id' => 7, 'name' => 'Cargar mapa', 'description' => 'Abrir el módulo de mapa en la consola', 'expected_result' => 'El mapa carga correctamente sin errores visuales'],
            ['test_type_id' => 7, 'name' => 'Ver usuarios en mapa', 'description' => 'Tener usuarios conectados enviando GPS', 'expected_result' => 'Aparecen los marcadores de usuarios en el mapa'],
            ['test_type_id' => 7, 'name' => 'Actualización GPS en vivo', 'description' => 'Mover un usuario/radio que envía ubicación', 'expected_result' => 'El marcador cambia de posición automáticamente'],
            ['test_type_id' => 7, 'name' => 'Usuario conectado sin GPS', 'description' => 'Ver un usuario activo que no envía ubicación', 'expected_result' => 'No rompe el mapa y muestra estado sin ubicación'],
            ['test_type_id' => 7, 'name' => 'Ver detalle de marcador', 'description' => 'Hacer clic sobre un marcador de usuario', 'expected_result' => 'Muestra información del usuario y su última ubicación'],
            ['test_type_id' => 7, 'name' => 'Validar datos del marcador', 'description' => 'Revisar nombre, alias, grupo, fecha/hora, latitud y longitud', 'expected_result' => 'La información mostrada corresponde al usuario seleccionado'],
            ['test_type_id' => 7, 'name' => 'Filtrar mapa por grupo', 'description' => 'Seleccionar un grupo específico', 'expected_result' => 'Muestra solo los usuarios pertenecientes a ese grupo'],
            ['test_type_id' => 7, 'name' => 'Filtrar usuarios activos en mapa', 'description' => 'Aplicar filtro de usuarios online/activos', 'expected_result' => 'Muestra únicamente usuarios activos según el filtro'],
            ['test_type_id' => 7, 'name' => 'Coordenadas inválidas', 'description' => 'Usuario con latitud/longitud nula, vacía o incorrecta', 'expected_result' => 'No coloca marcador erróneo ni falla la consola'],
            ['test_type_id' => 7, 'name' => 'Usuario offline con última ubicación', 'description' => 'Consultar usuario desconectado que tuvo GPS previo', 'expected_result' => 'Muestra última ubicación conocida si el sistema lo permite'],
            ['test_type_id' => 7, 'name' => 'Pérdida de conexión del mapa', 'description' => 'Cortar Internet mientras el mapa está abierto', 'expected_result' => 'Muestra error o estado de reconexión sin romper la pantalla'],
            ['test_type_id' => 7, 'name' => 'Reanudación de conexión', 'description' => 'Restaurar Internet después de una pérdida', 'expected_result' => 'El mapa vuelve a actualizar posiciones correctamente'],
            ['test_type_id' => 7, 'name' => 'Muchos usuarios en mapa', 'description' => 'Cargar varios usuarios con GPS activo', 'expected_result' => 'El mapa mantiene rendimiento aceptable'],
            ['test_type_id' => 7, 'name' => 'Zoom y desplazamiento', 'description' => 'Hacer zoom y mover el mapa', 'expected_result' => 'El mapa responde correctamente y mantiene los marcadores'],
            ['test_type_id' => 7, 'name' => 'Historial GPS por usuario', 'description' => 'Seleccionar usuario y rango de fechas', 'expected_result' => 'Muestra los puntos históricos del usuario'],
            ['test_type_id' => 7, 'name' => 'Usuario sin historial GPS', 'description' => 'Consultar historial de usuario sin puntos registrados', 'expected_result' => 'Muestra mensaje de "sin datos"'],
            ['test_type_id' => 7, 'name' => 'Filtrar historial por fecha', 'description' => 'Seleccionar un rango específico', 'expected_result' => 'Muestra solo los puntos dentro del rango seleccionado'],
            ['test_type_id' => 7, 'name' => 'Orden del historial', 'description' => 'Consultar varios puntos históricos', 'expected_result' => 'Los puntos aparecen ordenados cronológicamente'],
            ['test_type_id' => 7, 'name' => 'Dibujar ruta histórica', 'description' => 'Consultar historial con varios puntos GPS', 'expected_result' => 'Se dibuja correctamente la ruta en el mapa'],
            ['test_type_id' => 7, 'name' => 'Ver detalle de punto histórico', 'description' => 'Hacer clic sobre un punto del historial', 'expected_result' => 'Muestra fecha, hora, latitud y longitud'],
            ['test_type_id' => 7, 'name' => 'Rango amplio de historial', 'description' => 'Consultar varios días o semanas', 'expected_result' => 'La consola responde sin congelarse'],
            ['test_type_id' => 7, 'name' => 'Validar hora del historial', 'description' => 'Comparar hora del punto contra la hora real del evento', 'expected_result' => 'Muestra la hora correcta del evento GPS'],
            ['test_type_id' => 7, 'name' => 'Limpiar historial mostrado', 'description' => 'Cerrar o limpiar consulta de historial', 'expected_result' => 'El mapa vuelve al estado normal sin puntos anteriores'],
            ['test_type_id' => 7, 'name' => 'Cambiar de usuario en historial', 'description' => 'Consultar historial de otro usuario', 'expected_result' => 'El mapa limpia la ruta anterior y muestra la nueva'],

            // PTT 1 a 1 Privado
            ['test_type_id' => 8, 'name' => 'Ver usuarios disponibles para PTT 1 a 1', 'description' => 'Abrir la lista de usuarios/contactos desde el radio', 'expected_result' => 'Muestra usuarios disponibles según permisos'],
            ['test_type_id' => 8, 'name' => 'Seleccionar usuario para PTT 1 a 1', 'description' => 'Elegir un usuario específico como destino', 'expected_result' => 'El radio deja seleccionado el usuario destino'],
            ['test_type_id' => 8, 'name' => 'Iniciar PTT 1 a 1 con usuario conectado', 'description' => 'Presionar PTT privado hacia un usuario disponible', 'expected_result' => 'Solo el usuario seleccionado recibe el audio'],
            ['test_type_id' => 8, 'name' => 'Recibir PTT 1 a 1', 'description' => 'Usuario A transmite privado a Usuario B', 'expected_result' => 'Usuario B escucha el audio privado'],
            ['test_type_id' => 8, 'name' => 'Validar privacidad del PTT 1 a 1', 'description' => 'Tener un tercer usuario conectado en el mismo grupo', 'expected_result' => 'El tercer usuario no escucha la transmisión privada'],
            ['test_type_id' => 8, 'name' => 'PTT 1 a 1 con usuario offline', 'description' => 'Intentar transmitir a un usuario desconectado', 'expected_result' => 'Muestra usuario no disponible o no permite transmitir'],
            ['test_type_id' => 8, 'name' => 'PTT 1 a 1 con usuario ocupado', 'description' => 'Intentar transmitir a usuario que ya está en otra comunicación', 'expected_result' => 'Muestra ocupado y no transmite'],
            ['test_type_id' => 8, 'name' => 'Soltar PTT 1 a 1', 'description' => 'Soltar el botón durante la transmisión privada', 'expected_result' => 'La transmisión se detiene correctamente'],
            ['test_type_id' => 8, 'name' => 'Pulsaciones rápidas en PTT 1 a 1', 'description' => 'Presionar y soltar varias veces seguidas', 'expected_result' => 'No duplica sesiones ni deja canal bloqueado'],
            ['test_type_id' => 8, 'name' => 'Corte de red durante PTT 1 a 1', 'description' => 'Perder conexión mientras transmite en privado', 'expected_result' => 'Se corta la transmisión y se libera el estado ocupado'],
            ['test_type_id' => 8, 'name' => 'Cambiar destinatario PTT 1 a 1', 'description' => 'Seleccionar otro usuario después de una transmisión privada', 'expected_result' => 'La nueva transmisión se envía solo al nuevo usuario'],
            ['test_type_id' => 8, 'name' => 'Indicador visual de PTT 1 a 1', 'description' => 'Transmitir o recibir PTT privado', 'expected_result' => 'El radio muestra claramente que es comunicación privada'],
            ['test_type_id' => 8, 'name' => 'Registro de PTT 1 a 1', 'description' => 'Revisar logs o historial operativo', 'expected_result' => 'Se registra origen, destino, hora y duración si aplica'],

            // Llamada 1 a 1
            ['test_type_id' => 9, 'name' => 'Ver usuarios disponibles para llamada 1 a 1', 'description' => 'Abrir lista de contactos o usuarios desde el radio', 'expected_result' => 'Muestra usuarios llamables según permisos'],
            ['test_type_id' => 9, 'name' => 'Iniciar llamada 1 a 1', 'description' => 'Seleccionar usuario y presionar llamar', 'expected_result' => 'Se envía invitación de llamada al usuario destino'],
            ['test_type_id' => 9, 'name' => 'Tono de llamada saliente', 'description' => 'Iniciar llamada hacia otro usuario', 'expected_result' => 'El radio emisor reproduce tono o muestra estado "llamando"'],
            ['test_type_id' => 9, 'name' => 'Tono de llamada entrante', 'description' => 'Usuario B recibe llamada de Usuario A', 'expected_result' => 'El radio receptor reproduce tono o alerta de llamada'],
            ['test_type_id' => 9, 'name' => 'Aceptar llamada 1 a 1', 'description' => 'Usuario receptor acepta la llamada', 'expected_result' => 'Se establece comunicación privada entre ambos usuarios'],
            ['test_type_id' => 9, 'name' => 'Rechazar llamada 1 a 1', 'description' => 'Usuario receptor rechaza la llamada', 'expected_result' => 'El emisor recibe estado rechazado y la llamada termina'],
            ['test_type_id' => 9, 'name' => 'Cancelar llamada saliente', 'description' => 'Usuario emisor cancela antes de que contesten', 'expected_result' => 'El receptor deja de sonar y la llamada queda cancelada'],
            ['test_type_id' => 9, 'name' => 'Timeout de llamada no contestada', 'description' => 'No responder la llamada entrante', 'expected_result' => 'La llamada finaliza automáticamente después del tiempo definido'],
            ['test_type_id' => 9, 'name' => 'Llamada a usuario offline', 'description' => 'Intentar llamar a usuario desconectado', 'expected_result' => 'Muestra usuario no disponible o llamada fallida'],
            ['test_type_id' => 9, 'name' => 'Llamada a usuario ocupado', 'description' => 'Intentar llamar a usuario en otra llamada o PTT', 'expected_result' => 'Muestra ocupado y no inicia la llamada'],
            ['test_type_id' => 9, 'name' => 'Audio durante llamada 1 a 1', 'description' => 'Aceptar llamada y hablar ambos usuarios', 'expected_result' => 'Ambos usuarios se escuchan correctamente'],
            ['test_type_id' => 9, 'name' => 'Privacidad de llamada 1 a 1', 'description' => 'Tener un tercer usuario conectado', 'expected_result' => 'El tercer usuario no escucha la llamada'],
            ['test_type_id' => 9, 'name' => 'Finalizar llamada desde emisor', 'description' => 'Emisor cuelga la llamada activa', 'expected_result' => 'La llamada termina para ambos usuarios'],
            ['test_type_id' => 9, 'name' => 'Finalizar llamada desde receptor', 'description' => 'Receptor cuelga la llamada activa', 'expected_result' => 'La llamada termina para ambos usuarios'],
            ['test_type_id' => 9, 'name' => 'Pérdida de red durante llamada', 'description' => 'Cortar Internet de uno de los radios', 'expected_result' => 'La llamada se corta o entra en reconexión según diseño'],
            ['test_type_id' => 9, 'name' => 'Recuperación de red durante llamada', 'description' => 'Restaurar conexión rápidamente', 'expected_result' => 'La llamada se recupera o finaliza limpiamente según diseño'],
            ['test_type_id' => 9, 'name' => 'Indicador visual de llamada', 'description' => 'Validar estados entrante, saliente y activa', 'expected_result' => 'El radio muestra "llamando", "entrante", "en llamada" o "finalizada"'],
            ['test_type_id' => 9, 'name' => 'Volumen y tono', 'description' => 'Recibir llamada con volumen bajo/alto', 'expected_result' => 'El tono se reproduce correctamente según configuración'],
            ['test_type_id' => 9, 'name' => 'Pantalla apagada', 'description' => 'Recibir llamada con pantalla apagada', 'expected_result' => 'El radio notifica la llamada si el diseño lo requiere'],
            ['test_type_id' => 9, 'name' => 'Cancelación simultánea', 'description' => 'Emisor cancela mientras receptor intenta aceptar', 'expected_result' => 'El sistema queda en estado consistente'],
            ['test_type_id' => 9, 'name' => 'Doble llamada entrante', 'description' => 'Recibir otra llamada mientras una está activa', 'expected_result' => 'La segunda llamada se rechaza, queda en espera o muestra ocupado según diseño'],
            ['test_type_id' => 9, 'name' => 'Registro de llamada 1 a 1', 'description' => 'Finalizar llamada privada', 'expected_result' => 'Se registra origen, destino, hora, duración y estado si aplica'],
        ];

        DB::table('tests')->insert($tests);
    }
}
