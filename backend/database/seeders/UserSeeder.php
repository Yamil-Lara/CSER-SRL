<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. ADMINISTRADOR (SOLO UNO)
        // ==========================================
        User::firstOrCreate(
            ['email' => 'admin@cser.com'],
            [
                'nombre'       => 'Administrador CSER',
                'username'     => 'admin_cser',
                'password'     => Hash::make('Admin@2026'),
                'rol'          => 'admin',
                'estado'       => 'aprobado',
                'activo'       => true,
                'profesion'    => 'Administrador del Sistema',
                'especialidad' => 'Gestión de plataformas',
                'biografia'    => 'Administrador principal del sistema CSER S.R.L.',
                'ubicacion'    => 'Cochabamba, Bolivia',
            ]
        );

        // ==========================================
        // 2. USUARIOS EXISTENTES (SE MANTIENEN)
        // ==========================================
        
        User::firstOrCreate(
            ['email' => 'maria.garcia@cser.com'],
            [
                'nombre'       => 'María García',
                'username'     => 'mariagarcia',
                'password'     => Hash::make('Usuario@2026'),
                'rol'          => 'usuario',
                'estado'       => 'aprobado',
                'activo'       => true,
                'profesion'    => 'Desarrolladora Full Stack',
                'especialidad' => 'PHP, Laravel, React',
                'biografia'    => 'Desarrolladora con 3 años de experiencia en aplicaciones web modernas.',
                'ubicacion'    => 'Cochabamba, Bolivia',
                'linkedin'     => 'https://linkedin.com/in/maria-garcia-dev',
                'github_perfil'=> 'https://github.com/mariagarcia',
                'universidad'  => 'Universidad Mayor de San Simón',
                'carrera'      => 'Licenciatura en Informática',
                'nivel_estudios'=> 'Titulado',
            ]
        );

        User::firstOrCreate(
            ['email' => 'carlos.mamani@cser.com'],
            [
                'nombre'       => 'Carlos Mamani',
                'username'     => 'carlosmamani',
                'password'     => Hash::make('Usuario@2026'),
                'rol'          => 'usuario',
                'estado'       => 'aprobado',
                'activo'       => true,
                'profesion'    => 'Ingeniero de Software',
                'especialidad' => 'Python, Django, Machine Learning',
                'biografia'    => 'Apasionado por la inteligencia artificial y el análisis de datos.',
                'ubicacion'    => 'La Paz, Bolivia',
                'linkedin'     => 'https://linkedin.com/in/carlos-mamani-dev',
                'github_perfil'=> 'https://github.com/carlosmamani',
                'universidad'  => 'Universidad Mayor de San Simón',
                'carrera'      => 'Ingeniería de Sistemas',
                'nivel_estudios'=> 'Titulado',
            ]
        );

        // ==========================================
        // 3. USUARIOS ADICIONALES (22 USUARIOS)
        // ==========================================
        
        $usuariosAdicionales = [
            [
                'email' => 'ana.lopez@cser.com',
                'nombre' => 'Ana López',
                'username' => 'analopez',
                'profesion' => 'Desarrolladora Frontend',
                'especialidad' => 'React, Vue.js, Tailwind',
                'ubicacion' => 'Santa Cruz, Bolivia',
                'universidad' => 'Universidad Privada Boliviana',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'juan.paredes@cser.com',
                'nombre' => 'Juan Paredes',
                'username' => 'juanparedes',
                'profesion' => 'DevOps Engineer',
                'especialidad' => 'Docker, Kubernetes, AWS',
                'ubicacion' => 'La Paz, Bolivia',
                'universidad' => 'Universidad Mayor de San Andrés',
                'carrera' => 'Ingeniería Informática',
            ],
            [
                'email' => 'laura.mendoza@cser.com',
                'nombre' => 'Laura Mendoza',
                'username' => 'lauramendoza',
                'profesion' => 'Data Scientist',
                'especialidad' => 'Python, TensorFlow, Pandas',
                'ubicacion' => 'Cochabamba, Bolivia',
                'universidad' => 'Universidad Mayor de San Simón',
                'carrera' => 'Estadística e Informática',
            ],
            [
                'email' => 'pedro.vega@cser.com',
                'nombre' => 'Pedro Vega',
                'username' => 'pedrovega',
                'profesion' => 'Mobile Developer',
                'especialidad' => 'Flutter, Dart, Firebase',
                'ubicacion' => 'Sucre, Bolivia',
                'universidad' => 'Universidad San Francisco Xavier',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'sofia.ramirez@cser.com',
                'nombre' => 'Sofía Ramírez',
                'username' => 'sofiaramirez',
                'profesion' => 'UX/UI Designer',
                'especialidad' => 'Figma, Adobe XD, Sketch',
                'ubicacion' => 'Tarija, Bolivia',
                'universidad' => 'Universidad Autónoma Juan Misael Saracho',
                'carrera' => 'Diseño Gráfico',
            ],
            [
                'email' => 'diego.flores@cser.com',
                'nombre' => 'Diego Flores',
                'username' => 'diegoflores',
                'profesion' => 'Backend Developer',
                'especialidad' => 'Laravel, Node.js, PostgreSQL',
                'ubicacion' => 'Oruro, Bolivia',
                'universidad' => 'Universidad Técnica de Oruro',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'carla.rojas@cser.com',
                'nombre' => 'Carla Rojas',
                'username' => 'carlarojas',
                'profesion' => 'QA Tester',
                'especialidad' => 'Selenium, PHPUnit, Jest',
                'ubicacion' => 'Potosi, Bolivia',
                'universidad' => 'Universidad Tomás Frías',
                'carrera' => 'Ingeniería Informática',
            ],
            [
                'email' => 'andres.cruz@cser.com',
                'nombre' => 'Andrés Cruz',
                'username' => 'andrescruz',
                'profesion' => 'Tech Lead',
                'especialidad' => 'Arquitectura de Software, Liderazgo',
                'ubicacion' => 'Cochabamba, Bolivia',
                'universidad' => 'Universidad Mayor de San Simón',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'valentina.silva@cser.com',
                'nombre' => 'Valentina Silva',
                'username' => 'valentinasilva',
                'profesion' => 'Cybersecurity Specialist',
                'especialidad' => 'Seguridad informática, Pentesting',
                'ubicacion' => 'La Paz, Bolivia',
                'universidad' => 'Universidad Mayor de San Andrés',
                'carrera' => 'Ingeniería en Redes',
            ],
            [
                'email' => 'ricardo.morales@cser.com',
                'nombre' => 'Ricardo Morales',
                'username' => 'ricardomorales',
                'profesion' => 'Scrum Master',
                'especialidad' => 'Metodologías Ágiles, JIRA',
                'ubicacion' => 'Santa Cruz, Bolivia',
                'universidad' => 'Universidad Privada Boliviana',
                'carrera' => 'Administración de Empresas',
            ],
            [
                'email' => 'gabriela.navarro@cser.com',
                'nombre' => 'Gabriela Navarro',
                'username' => 'gabrielanavarro',
                'profesion' => 'Product Owner',
                'especialidad' => 'Gestión de Productos, Agile',
                'ubicacion' => 'Cochabamba, Bolivia',
                'universidad' => 'Universidad Católica Boliviana',
                'carrera' => 'Ingeniería Comercial',
            ],
            [
                'email' => 'fernando.paz@cser.com',
                'nombre' => 'Fernando Paz',
                'username' => 'fernandopaz',
                'profesion' => 'Arquitecto de Software',
                'especialidad' => 'Microservicios, Cloud Architecture',
                'ubicacion' => 'La Paz, Bolivia',
                'universidad' => 'Universidad Mayor de San Andrés',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'lucia.ferreira@cser.com',
                'nombre' => 'Lucía Ferreira',
                'username' => 'luciaferreira',
                'profesion' => 'Data Engineer',
                'especialidad' => 'ETL, Big Data, Spark',
                'ubicacion' => 'Santa Cruz, Bolivia',
                'universidad' => 'Universidad Autónoma Gabriel René Moreno',
                'carrera' => 'Ingeniería Informática',
            ],
            [
                'email' => 'javier.aldana@cser.com',
                'nombre' => 'Javier Aldana',
                'username' => 'javieraldana',
                'profesion' => 'Full Stack Developer',
                'especialidad' => 'MERN Stack, TypeScript',
                'ubicacion' => 'Sucre, Bolivia',
                'universidad' => 'Universidad San Francisco Xavier',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'paola.guzman@cser.com',
                'nombre' => 'Paola Guzmán',
                'username' => 'paolaguzman',
                'profesion' => 'AI Specialist',
                'especialidad' => 'Machine Learning, NLP',
                'ubicacion' => 'Cochabamba, Bolivia',
                'universidad' => 'Universidad Mayor de San Simón',
                'carrera' => 'Ingeniería Informática',
            ],
            [
                'email' => 'miguel.ortega@cser.com',
                'nombre' => 'Miguel Ortega',
                'username' => 'miguelortega',
                'profesion' => 'Blockchain Developer',
                'especialidad' => 'Solidity, Web3, Ethereum',
                'ubicacion' => 'La Paz, Bolivia',
                'universidad' => 'Universidad Católica Boliviana',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'daniela.mercado@cser.com',
                'nombre' => 'Daniela Mercado',
                'username' => 'danielamercado',
                'profesion' => 'Game Developer',
                'especialidad' => 'Unity, C#, Unreal Engine',
                'ubicacion' => 'Santa Cruz, Bolivia',
                'universidad' => 'Universidad Privada Boliviana',
                'carrera' => 'Ingeniería de Software',
            ],
            [
                'email' => 'roberto.castillo@cser.com',
                'nombre' => 'Roberto Castillo',
                'username' => 'robertocastillo',
                'profesion' => 'Database Administrator',
                'especialidad' => 'MySQL, PostgreSQL, MongoDB',
                'ubicacion' => 'Tarija, Bolivia',
                'universidad' => 'Universidad Autónoma Juan Misael Saracho',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'monica.veizaga@cser.com',
                'nombre' => 'Mónica Veizaga',
                'username' => 'monicaveizaga',
                'profesion' => 'Cloud Engineer',
                'especialidad' => 'AWS, Azure, GCP',
                'ubicacion' => 'Oruro, Bolivia',
                'universidad' => 'Universidad Técnica de Oruro',
                'carrera' => 'Ingeniería Informática',
            ],
            [
                'email' => 'saul.quiroga@cser.com',
                'nombre' => 'Saúl Quiroga',
                'username' => 'saulquiroga',
                'profesion' => 'RPA Developer',
                'especialidad' => 'UiPath, Automation Anywhere',
                'ubicacion' => 'Potosí, Bolivia',
                'universidad' => 'Universidad Tomás Frías',
                'carrera' => 'Ingeniería de Sistemas',
            ],
            [
                'email' => 'elena.vargas@cser.com',
                'nombre' => 'Elena Vargas',
                'username' => 'elenavargas',
                'profesion' => 'Technical Writer',
                'especialidad' => 'Documentación técnica, Markdown',
                'ubicacion' => 'Cochabamba, Bolivia',
                'universidad' => 'Universidad Mayor de San Simón',
                'carrera' => 'Comunicación Social',
            ],
            [
                'email' => 'mario.calle@cser.com',
                'nombre' => 'Mario Calle',
                'username' => 'mariocalle',
                'profesion' => 'Systems Analyst',
                'especialidad' => 'Análisis de Requerimientos, UML',
                'ubicacion' => 'La Paz, Bolivia',
                'universidad' => 'Universidad Mayor de San Andrés',
                'carrera' => 'Ingeniería de Sistemas',
            ],
        ];

        // Crear los usuarios adicionales
        foreach ($usuariosAdicionales as $usuario) {
            User::firstOrCreate(
                ['email' => $usuario['email']],
                [
                    'nombre'       => $usuario['nombre'],
                    'username'     => $usuario['username'],
                    'password'     => Hash::make('Usuario@2026'),
                    'rol'          => 'usuario',
                    'estado'       => 'aprobado',
                    'activo'       => true,
                    'profesion'    => $usuario['profesion'],
                    'especialidad' => $usuario['especialidad'],
                    'biografia'    => "Profesional apasionado por la tecnología con más de 5 años de experiencia en el área.",
                    'ubicacion'    => $usuario['ubicacion'],
                    'universidad'  => $usuario['universidad'],
                    'carrera'      => $usuario['carrera'],
                    'nivel_estudios'=> 'Titulado',
                ]
            );
        }
    }
}