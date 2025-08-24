// app/page.tsx

import Link from 'next/link';
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Zap, 
  Smartphone,
  Users,
  Settings,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Smart Home</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Възможности
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                За нас
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Контакт
              </a>
              <Link 
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Влез в Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Бъдещето на
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                умния дом
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Управлявайте осветлението, климата, сигурността и енергията на вашия дом 
              с една интелигентна система. Изградено специално за българския пазар.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Започни сега
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
                Научи повече
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Всичко, от което се нуждаете
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Пълно IoT решение за модерния дом с интуитивно управление и надежда сигурност
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Lighting */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Интелигентно осветление</h3>
              <p className="text-gray-300">
                Контролирайте яркостта, цвета и режимите на всички лампи в дома
              </p>
            </div>

            {/* Climate */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Thermometer className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Климат контрол</h3>
              <p className="text-gray-300">
                Автоматично регулиране на температурата и влажността във всяка стая
              </p>
            </div>

            {/* Security */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Сигурност</h3>
              <p className="text-gray-300">
                Камери, сензори и уведомления в реално време за максимална защита
              </p>
            </div>

            {/* Energy */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Енергиен мониторинг</h3>
              <p className="text-gray-300">
                Следете потреблението и оптимизирайте разходите за електроенергия
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Защо да изберете нашето решение?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Лесна инсталация</h3>
                    <p className="text-gray-300">Интеграция още при строежа за най-добър резултат</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Българска поддръжка</h3>
                    <p className="text-gray-300">Локален екип, бърза реакция, говорим български</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Модулна система</h3>
                    <p className="text-gray-300">Започнете малко, добавяйте функции с времето</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Отворени стандарти</h3>
                    <p className="text-gray-300">Не сте заключени в нашата екосистема</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Пълен контрол</h3>
                <p className="text-gray-300">от всяко устройство, навсякъде</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-gray-300">Мониторинг</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-sm text-gray-300">Време на работа</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">&lt;1s</div>
                  <div className="text-sm text-gray-300">Време за отговор</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white mb-1">100+</div>
                  <div className="text-sm text-gray-300">Устройства</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Готови за умния дом на бъдещето?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Започнете днес и превърнете дома си в интелигентна екосистема
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Вижте Dashboard
            </Link>
            
            <a 
              href="tel:+359888123456"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Свържете се с нас
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">Smart Home</span>
              </div>
              <p className="text-sm">
                Иновативни IoT решения за модерния български дом.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Продукти</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Осветление</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Климат контрол</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Сигурност</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Енергиен мониторинг</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Поддръжка</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Инсталация</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакт</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Контакт</h3>
              <div className="space-y-2 text-sm">
                <p>София, България</p>
                <p>+359 888 123 456</p>
                <p>info@smarthome.bg</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Smart Home Solutions. Всички права запазени.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}