import { vi, test, expect } from 'vitest'
import { toArray } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'

import GDCJSONAdapter from './GDCJSONAdapter'
import configSchema from './configSchema'
import {
  mutationsJSON,
  genesJSON,
  gdcResponse,
} from './test_data/json_test_data.js'

test('adapter can fetch features from a mutations explore json file', async () => {
  const adapter = new GDCJSONAdapter(
    configSchema.create({
      featureType: 'mutation',
      data: JSON.stringify(mutationsJSON),
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr3',
    start: 0,
    end: 124925000,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  expect(featuresArray.slice(0, 3)).toMatchSnapshot()
})

test('adapter can fetch featues from a genes explore json file', async () => {
  const adapter = new GDCJSONAdapter(
    configSchema.create({
      featureType: 'gene',
      data: JSON.stringify(genesJSON),
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr5',
    start: 142770384,
    end: 143229011,
  })

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(gdcResponse))),
  )

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  expect(featuresArray.slice(0, 3)).toMatchSnapshot()
})
