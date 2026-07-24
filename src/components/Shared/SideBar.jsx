import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, Links, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    CubeIcon,
} from '@heroicons/react/24/outline';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { Settings, Film, TagIcon, Users } from 'lucide-react';
import { useAuth } from 'context/AuthContext';

const MENU_GROUPS = [
    {
        groupName: 'Principal',
        items: [
            {
                section: 'Home',
                link: '/home',
                icon: HomeIcon,
            }
        ]
    },
    {
        groupName: 'Contenido',
        items: [
            {
                section: 'Películas', icon: Film,
                subs: [
                    { name: 'Listar', link: '/pelicula/listar', requiredPermission: 'pelicula.index' },
                    { name: 'Agregar', link: '/pelicula/agregar', requiredPermission: 'pelicula.store' },
                ],
            },
            {
                section: 'Géneros', icon: TagIcon,
                subs: [
                    { name: 'Listar', link: '/genero/listar', requiredPermission: 'genero.index' },
                    { name: 'Agregar', link: '/genero/agregar', requiredPermission: 'genero.store' },
                ],
            },
            {
                section: 'Actores', icon: Users, // desde lucide-react
                subs: [
                    { name: 'Listar', link: '/actor/listar', requiredPermission: 'actor.index' },
                    { name: 'Agregar', link: '/actor/agregar', requiredPermission: 'actor.store' },
                ],
            },
        ]
    },
    {
        groupName: 'Configuración',
        items: [
            {
                section: 'Roles y Permisos', icon: Settings,
                link: '/rol/listar', requiredPermission: 'rol.index'
            },
        ]
    }
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const location = useLocation();
    const { can, logout } = useAuth();

    const handleLogout = () => { logout(); setShowConfirm(false); };

    const userMenuGroups = useMemo(() => {
        return MENU_GROUPS.map(group => {
            const filteredItems = group.items.map(item => {
                if (item.subs) {
                    const visibleSubs = item.subs.filter(sub => can(sub.requiredPermission));
                    return { ...item, subs: visibleSubs };
                }
                return item;
            }).filter(item => {
                if (item.subs) return item.subs.length > 0;
                if (!item.requiredPermission) return true;
                return can(item.requiredPermission);
            });

            return { ...group, items: filteredItems };
        }).filter(group => group.items.length > 0);
    }, [can]);

    const handleSectionClick = (section) => {
        if (isCollapsed && window.innerWidth >= 768) {
            setIsCollapsed(false);
            setOpenSection(section);
        } else {
            setOpenSection(prev => prev === section ? null : section);
        }
    };

    const isSectionActive = useCallback((item) => {
        if (item.subs) return item.subs.some(sub => location.pathname.startsWith(sub.link));
        if (item.link) return location.pathname === item.link;
        return false;
    }, [location.pathname]);

    useEffect(() => {
        if (openSection === null) {
            for (const group of userMenuGroups) {
                const activeItem = group.items.find(item => isSectionActive(item));
                if (activeItem && activeItem.subs) {
                    setOpenSection(activeItem.section);
                    break;
                }
            }
        }
    }, [location.pathname, userMenuGroups, isSectionActive, openSection]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sidebarWidth = isCollapsed ? 'md:w-20' : 'md:w-72';

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#E8B04B] text-black rounded-md shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                <Bars3Icon className="h-6 w-6" />
            </button>

            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={`fixed left-0 top-0 h-screen bg-[#0D0C0E] border-r border-white/10 shadow-2xl z-40 transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full'} 
                    ${sidebarWidth} md:translate-x-0`}
                style={{ height: '100dvh' }}
            >
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-8 bg-[#E8B04B] border border-black/40 rounded-full p-1.5 shadow-md z-50 hover:bg-[#f0c06a] text-black transition-all"
                >
                    <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                <Link
                    to="/"
                    className={`flex items-center justify-center flex-shrink-0 border-b border-white/10 transition-all duration-300 relative ${isCollapsed ? 'h-24 md:h-20' : 'h-24'}`}
                >
                    <div className={`hidden md:flex absolute h-10 w-10 rounded-sm bg-[#B8232B] items-center justify-center transition-all duration-300 ${
                        isCollapsed ? 'opacity-100 scale-100 delay-100' : 'opacity-0 scale-50 pointer-events-none'
                    }`}>
                        <Film size={18} className="text-[#F5F0E8]" />
                    </div>

                    <div className={`font-black text-lg tracking-tight overflow-hidden transition-all duration-300 whitespace-nowrap text-white uppercase
                        ${isCollapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                        Pelis<span className="text-[#E8B04B]">Club</span>
                    </div>
                </Link>

                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4 hide-scrollbar px-3 relative">
                    {userMenuGroups.map((group, gIndex) => (
                        <div key={gIndex} className="mb-2">
                            <div className={`px-4 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest transition-all duration-300
                                ${isCollapsed ? 'md:opacity-0 md:h-0 md:mb-0 overflow-hidden' : 'opacity-100'}`}>
                                {group.groupName}
                            </div>

                            {isCollapsed && gIndex !== 0 && (
                                <div className="hidden md:block border-t border-white/10 my-3 mx-4" />
                            )}

                            <div className="space-y-1">
                                {group.items.map((item, idx) => {
                                    const isActive = isSectionActive(item);
                                    const isSubOpen = item.subs && openSection === item.section;
                                    const IconComponent = item.icon || CubeIcon;

                                    const itemBaseClasses = "flex items-center flex-nowrap w-full p-3 rounded-sm transition-all duration-200 group relative overflow-hidden";
                                    const activeClasses = "bg-[#E8B04B] text-black shadow-md font-bold";
                                    const inactiveClasses = "text-white/60 hover:bg-white/5 hover:text-white";

                                    return (
                                        <div key={idx}>
                                            {item.subs ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSectionClick(item.section)}
                                                        className={`${itemBaseClasses} ${isActive && isCollapsed ? 'bg-white/5 text-white' : (isActive ? activeClasses : inactiveClasses)}`}
                                                        title={isCollapsed ? item.section : ''}
                                                    >
                                                        <IconComponent className="h-5 w-5 flex-shrink-0 min-w-[20px]" />

                                                        <span className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 
                                                            ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                                                            {item.section}
                                                        </span>

                                                        <ChevronDownIcon
                                                            className={`ml-auto h-4 w-4 transition-transform duration-300 flex-shrink-0
                                                            ${isSubOpen ? 'rotate-180' : ''}
                                                            ${isCollapsed ? 'md:hidden' : ''}
                                                        `} />
                                                    </button>

                                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out 
                                                        ${isSubOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                                                        ${isCollapsed ? 'md:hidden' : ''} 
                                                    `}>
                                                        <ul className="ml-4 pl-4 border-l border-white/10 space-y-1">
                                                            {item.subs.map((sub, sIdx) => (
                                                                <li key={sIdx}>
                                                                    <Link to={sub.link} onClick={() => setIsOpen(false)}
                                                                        className={`block py-2 px-3 rounded-sm text-[13px] font-medium transition-colors truncate
                                                                        ${location.pathname.startsWith(sub.link)
                                                                            ? 'text-[#E8B04B] bg-white/5'
                                                                            : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <Link to={item.link} onClick={() => setIsOpen(false)}
                                                    className={`${itemBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                                    title={isCollapsed ? item.section : ''}
                                                >
                                                    <IconComponent className="h-5 w-5 flex-shrink-0 min-w-[20px]" />
                                                    <span className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300
                                                        ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                                                        {item.section}
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 flex-shrink-0 bg-[#0D0C0E]">
                    <button onClick={() => setShowConfirm(true)}
                        className={`flex items-center w-full p-3 rounded-sm text-white/50 hover:bg-red-900/10 hover:text-red-400 transition-all duration-200 group ${isCollapsed ? 'md:justify-center' : ''}`}
                        title="Cerrar Sesión">
                        <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 min-w-[20px]" />
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-semibold text-sm
                             ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                            Salir
                        </span>
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal message="¿Deseas cerrar sesión del sistema?" onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
            )}
        </>
    );
};

export default Sidebar;