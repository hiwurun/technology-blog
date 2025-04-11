import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './config'

// 排除的静态资源文件
const excludeFiles = ['search.json', 'favicon.ico']
// 匹配公共文件的正则
const publicFileRegex = /\.(json|ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/

function getLocale(request) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // 跳过 API、_next 和静态资源
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    publicFileRegex.test(pathname) ||
    excludeFiles.includes(pathname.slice(1))
  ) {
    return
  }

  // 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return
  }

  // 获取匹配的语言
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname || '/'}`

  // 执行重定向
  console.log('Redirecting to:', request.nextUrl.pathname) // 调试日志
  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // 排除 API、_next 和所有带扩展名的文件
    '/((?!api|_next|.*\\..*).*)',
  ],
}
