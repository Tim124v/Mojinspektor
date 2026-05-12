import { useState } from 'react'
import useAppStore from '../store/appStore'
import AppLogo from './AppLogo.jsx'

const slides = [
  {
    useBrandLogo: true,
    title: 'Готуєтесь до Карти поляка або Сталого побуту?',
    description:
      'Більшість людей приходять на співбесіду непідготовленими — і провалюються на питаннях про родину, традиції та польську ідентичність. Цей застосунок створила людина, яка сама пройшла через це і знає що питає інспектор насправді.',
  },
  {
    icon: '👨‍💼',
    title: 'Симуляція реальної співбесіди з AI-інспектором',
    description:
      'AI-інспектор будує з вами дерево родини, питає про біографію, традиції та польську ідентичність — точно як на справжній співбесіді. Отримайте оцінку і конкретні поради що покращити. Без репетитора.',
  },
  {
    icon: '📝',
    title: '90% того що чекає вас на іспиті — тут',
    description:
      '300+ реальних питань з співбесід. Підготовка до держіспиту B1: письмо з AI-перевіркою, читання, аудіювання та рольові ігри. Все що потрібно — в одному застосунку.',
  },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const markFirstLaunchDone = useAppStore(s => s.markFirstLaunchDone)

  function handleNext() {
    if (current < slides.length - 1) {
      setCurrent(c => c + 1)
    } else {
      markFirstLaunchDone()
    }
  }

  const slide = slides[current]

  return (
    <div className="app-container flex flex-col items-center justify-between min-h-screen px-6 py-12 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${
            slide.useBrandLogo
              ? 'bg-white ring-1 ring-gray-100 shadow-sm p-2'
              : 'bg-primary text-5xl'
          }`}
        >
          {slide.useBrandLogo ? <AppLogo size={88} /> : <span>{slide.icon}</span>}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{slide.title}</h1>
        <p className="text-gray-500 text-base leading-relaxed">{slide.description}</p>
      </div>

      <div className="w-full">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </div>
        {current === slides.length - 1 && (
          <div className="mx-4 mb-4 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">📲 Встанови як додаток</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                <span className="font-medium">iOS:</span> Safari → кнопка «Поділитися» → «На екран Home»
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Android:</span> Chrome → меню ⋮ → «Встановити додаток»
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl text-base min-h-11"
        >
          {current < slides.length - 1 ? 'Далі →' : 'Розпочати'}
        </button>
        {current < slides.length - 1 && (
          <button
            onClick={markFirstLaunchDone}
            className="w-full mt-3 text-gray-400 text-sm py-2"
          >
            Пропустити
          </button>
        )}
      </div>
    </div>
  )
}
