import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MdHttp } from "react-icons/md";
import { FaDatabase } from 'react-icons/fa';

export default function EmptyConvoContainer() {
    return (
        <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
            <div className="max-w-xl w-full">
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <div className='flex flex-col justify-center items-center text-center'>
                                <img
                                    title='Realmate second logo'
                                    rel='noopener noreferrer'
                                    src='https://realmate.com.br/wp-content/uploads/2024/08/SVG-Logo-Menu.svg'
                                    className='w-[50px] h-[50px]' />
                                <p className="text-gray-700 text-sm">
                                    Bem-vindo(a) à aplicação de teste da API webhook para consumo de mensagens do WhatsApp.
                                </p>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className='flex flex-col justify-center items-center text-center'>
                                <MdHttp size={70} />
                                <p className="text-gray-700 text-sm">
                                    A ideia é simular o que já é possível fazer com requisições HTTP utilizando ferramentas como curl, Postman ou outros softwares de teste de APIs.
                                </p>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className='flex flex-col justify-center items-center text-center'>
                                <FaDatabase size={50} />
                                <p className="text-gray-700 text-sm">
                                    Todas as conversas criadas aqui são salvas em um banco de dados SQLite3 no backend. No entanto, para não comprometer os requisitos principais do desafio — manter apenas dois endpoints na API (`conversations/:id` e `webhook`) — o frontend armazena parte dos dados no lado do cliente utilizando Zustand, uma biblioteca de gerenciamento de estado.
                                </p>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className='flex flex-col justify-center items-center text-center'>
                                <img className='w-[100px] h-[40px]' src='next.svg'/>
                                <p className="text-gray-700 text-sm">
                                    Ou seja, quando a aplicação frontend for reiniciada, o usuário deverá iniciar novas conversas com novos IDs para que possa visualizá-las
                                </p>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="text-white hover:text-white bg-blue-600 hover:bg-blue-800 rounded-full p-2" />
                    <CarouselNext className="text-white bg-blue-600 hover:text-white hover:bg-blue-800 rounded-full p-2"/>
                </Carousel>
            </div>
        </div>
    );
}
