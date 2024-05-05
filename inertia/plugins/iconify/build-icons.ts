/**
 * This is an advanced example for creating icon bundles for Iconify SVG Framework.
 *
 * It creates a bundle from:
 * - All SVG files in a directory.
 * - Custom JSON files.
 * - Iconify icon sets.
 * - SVG framework.
 *
 * This example uses Iconify Tools to import and clean up icons.
 * For Iconify Tools documentation visit https://docs.iconify.design/tools/tools2/
 */
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'

// Installation: npm install --save-dev @iconify/tools @iconify/utils @iconify/json @iconify/iconify
import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools'
import type { IconifyJSON } from '@iconify/types'
import { getIcons, getIconsCSS, stringToIcon } from '@iconify/utils'

/**
 * Script configuration
 */
interface BundleScriptCustomSVGConfig {
  // Path to SVG files
  dir: string

  // True if icons should be treated as monotone: colors replaced with currentColor
  monotone: boolean

  // Icon set prefix
  prefix: string
}

interface BundleScriptCustomJSONConfig {
  // Path to JSON file
  filename: string

  // List of icons to import. If missing, all icons will be imported
  icons?: string[]
}

interface BundleScriptConfig {
  // Custom SVG to import and bundle
  svg?: BundleScriptCustomSVGConfig[]

  // Icons to bundled from @iconify/json packages
  icons?: string[]

  // List of JSON files to bundled
  // Entry can be a string, pointing to filename or a BundleScriptCustomJSONConfig object (see type above)
  // If entry is a string or object without 'icons' property, an entire JSON file will be bundled
  json?: (string | BundleScriptCustomJSONConfig)[]
}

const sources: BundleScriptConfig = {
  svg: [
    // {
    //   dir: 'src/assets/images/iconify-svg',
    //   monotone: true,
    //   prefix: 'custom',
    // },
    // {
    //   dir: 'emojis',
    //   monotone: false,
    //   prefix: 'emoji',
    // },
  ],

  icons: [
    // 'mdi:home',
    // 'mdi:account',
    // 'mdi:login',
    // 'mdi:logout',
    // 'octicon:book-24',
    // 'octicon:code-square-24',
  ],

  json: [
    // Custom JSON file
    // 'json/gg.json',

    // Iconify JSON file (@iconify/json is a package name, /json/ is directory where files are, then filename)
    // eslint-disable-next-line unicorn/prefer-module
    // require.resolve('@iconify-json/tabler/icons.json'),
    {
      // eslint-disable-next-line unicorn/prefer-module
      filename: require.resolve('@iconify-json/tabler/icons.json'),
      icons: [
        'lock',
        'lock-open',
        'circle',
        'chevron-up',
        'chevron-down',
        'chevron-right',
        'chevron-left',
        'x',
        'circle-dot',
        'minus',
        'plus',
        'search',
        'file-alert',
        'alert-circle',
        'upload',
        'language',
        'dots-vertical',
        'bell',
        'mail-opened',
        'circle-filled',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'align-left',
        'align-center',
        'align-right',
        'align-justified',
        'arrow-up',
        'layout-grid-add',
        'layout-grid',
        'sun',
        'moon-star',
        'device-desktop-analytics',
        'settings',
        'refresh',
        'color-picker',
        'code',
        'check',
        'copy',
        'brand-facebook-filled',
        'brand-twitter-filled',
        'brand-github-filled',
        'brand-google-filled',
        'brand-youtube-filled',
        'photo',
        'menu-2',
        'heart-filled',
        'heart',
        'calendar',
        'file-dollar',
        'user',
        'users',
        'device-desktop-analytics',
        'sun-high',
        'chart-bar',
        'chart-donut-3',
        'shopping-cart',
        'typography',
        'info-triangle',
        'checkbox',
        'corner-down-left',
        'logout',
        'smart-home',
        'file',
        'eye-off',
        'eye',
        'star-filled',
        'star',
        'filter',
        'map-pin',
        'currency-dollar',
        'moon-stars',
        'brand',
        'brand-envato',
        'wallet',
        'gift-card',
        'brand-asana',
        'hand-grab',
        'adjustments-horizontal',
        'file-invoice',
        'share',
        'bookmarks',
        'trash',
        'edit',
        'pencil',
        'cloud-upload',
        'alarm',
        'truck-delivery',
        'walk',
      ],
    },
    {
      // eslint-disable-next-line unicorn/prefer-module
      filename: require.resolve('@iconify-json/mdi/icons.json'),
      icons: ['close-circle', 'language-javascript', 'language-typescript'],
    },
    {
      // eslint-disable-next-line unicorn/prefer-module
      filename: require.resolve('@iconify-json/fa/icons.json'),
      icons: ['circle'],
    },

    // Custom file with only few icons
    // {
    //   filename: require.resolve('@iconify-json/line-md/icons.json'),
    //   icons: [
    //     'home-twotone-alt',
    //     'github',
    //     'document-list',
    //     'document-code',
    //     'image-twotone',
    //   ],
    // },
  ],
}

// File to save bundle to
// eslint-disable-next-line unicorn/prefer-module
const target = join(__dirname, 'icons.css')

/**
 * Do stuff!
 */

;(async function () {
  // Create directory for output if missing
  const dir = dirname(target)
  try {
    await fs.mkdir(dir, {
      recursive: true,
    })
  } catch (err) {
    //
  }

  const allIcons: IconifyJSON[] = []

  /**
   * Convert sources.icons to sources.json
   */
  if (sources.icons) {
    const sourcesJSON = sources.json ? sources.json : (sources.json = [])

    // Sort icons by prefix
    const organizedList = organizeIconsList(sources.icons)

    for (const prefix in organizedList) {
      // eslint-disable-next-line unicorn/prefer-module
      const filename = require.resolve(`@iconify/json/json/${prefix}.json`)

      sourcesJSON.push({
        filename,
        icons: organizedList[prefix],
      })
    }
  }

  /**
   * Bundle JSON files and collect icons
   */
  if (sources.json) {
    for (let i = 0; i < sources.json.length; i++) {
      const item = sources.json[i]

      // Load icon set
      const filename = typeof item === 'string' ? item : item.filename
      const content = JSON.parse(await fs.readFile(filename, 'utf8')) as IconifyJSON

      for (const key in content) {
        if (key === 'prefix' && content.prefix === 'tabler') {
          for (const k in content.icons)
            content.icons[k].body = content.icons[k].body.replace(
              /stroke-width="2"/g,
              'stroke-width="1.5"'
            )
        }
      }

      // Filter icons
      if (typeof item !== 'string' && item.icons?.length) {
        const filteredContent = getIcons(content, item.icons)

        if (!filteredContent) throw new Error(`Cannot find required icons in ${filename}`)

        // Collect filtered icons
        allIcons.push(filteredContent)
      } else {
        // Collect all icons from the JSON file
        allIcons.push(content)
      }
    }
  }

  /**
   * Bundle custom SVG icons and collect icons
   */
  if (sources.svg) {
    for (let i = 0; i < sources.svg.length; i++) {
      const source = sources.svg[i]

      // Import icons
      const iconSet = await importDirectory(source.dir, {
        prefix: source.prefix,
      })

      // Validate, clean up, fix palette, etc.
      await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') return

        // Get SVG instance for parsing
        const svg = iconSet.toSVG(name)

        if (!svg) {
          // Invalid icon
          iconSet.remove(name)

          return
        }

        // Clean up and optimise icons
        try {
          // Clean up icon code
          await cleanupSVG(svg)

          if (source.monotone) {
            // Replace color with currentColor, add if missing
            // If icon is not monotone, remove this code
            await parseColors(svg, {
              defaultColor: 'currentColor',
              callback: (attr, colorStr, color) => {
                return !color || isEmptyColor(color) ? colorStr : 'currentColor'
              },
            })
          }

          // Optimise
          await runSVGO(svg)
        } catch (err) {
          // Invalid icon
          console.error(`Error parsing ${name} from ${source.dir}:`, err)
          iconSet.remove(name)

          return
        }

        // Update icon from SVG instance
        iconSet.fromSVG(name, svg)
      })

      // Collect the SVG icon
      allIcons.push(iconSet.export())
    }
  }

  // Generate CSS from collected icons
  const cssContent = allIcons
    .map((iconSet) =>
      getIconsCSS(iconSet, Object.keys(iconSet.icons), {
        iconSelector: '.{prefix}-{name}',
        mode: 'mask',
      })
    )
    .join('\n')

  // Save the CSS to a file
  await fs.writeFile(target, cssContent, 'utf8')

  console.log(`Saved CSS to ${target}!`)
})().catch((err) => {
  console.error(err)
})

/**
 * Sort icon names by prefix
 */
function organizeIconsList(icons: string[]): Record<string, string[]> {
  const sorted: Record<string, string[]> = Object.create(null)

  icons.forEach((icon) => {
    const item = stringToIcon(icon)

    if (!item) return

    const prefix = item.prefix
    const prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = [])

    const name = item.name

    if (!prefixList.includes(name)) prefixList.push(name)
  })

  return sorted
}
