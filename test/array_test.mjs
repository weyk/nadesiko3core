/* eslint-disable no-undef */
import assert from 'assert'
import { NakoCompiler } from '../src/nako3.mjs'

describe('array_test', async () => {
  const cmp = async (/** @type {string} */code, /** @type {string} */res) => {
    const nako = new NakoCompiler()
    nako.logger.debug('code=' + code)
    assert.strictEqual((await nako.runAsync(code)).log, res)
  }
  // --- test ---
  it('配列の基本テスト', async () => {
    await cmp('A=[0,1,2];A[0]を表示', '0')
    await cmp('A=[0,1,2];A@1を表示', '1')
  })
  it('二次元配列の参照 A[1][1]', async () => {
    await cmp('A=[[0,1,2],[3,4,5]];A[1][1]を表示', '4')
  })
  it('二次元配列の参照 A@1,1 #976 #1000', async () => {
    await cmp('A=[[0,1,2],[3,4,5]];A@1,1を表示', '4')
  })
  it('二次元配列@の参照 #976', async () => {
    await cmp('A=[[0,1,2],[3,4,5]];A@1@1を表示', '4')
    await cmp('A=[[0,1,2],[3,4,5]];A@1,1を表示', '4')
    await cmp('A=[[0,1,2],[3,4,5]];N,M=[1,1];A@N,Mを表示', '4')
  })
  it('二次元配列の代入 #976', async () => {
    await cmp('A=[[0,1,2],[3,4,5]];A[1][1]=100;A[1][1]を表示', '100')
    await cmp('A=[[0,1,2],[3,4,5]];N=1;M=1;A@N,M=100;A@N,Mを表示', '100')
    await cmp('A=[[0,1,2],[3,4,5]];A[1][1]を表示', '4')
  })
  it('要素から配列を記述する際に明示的な()が必要になる不具合 #1000', async () => {
    await cmp('Aは[0,1,2];Bは[A[1], A[1], A[2]];B[1]を表示', '1')
  })
  it('配列を「代入」文するとエラーが出る問題 (nadesiko3 #1354)(core #75)', async () => {
    await cmp('Aは[];1に2を足して、A[0]に代入。A[0]を表示。', '3')
  })
  it('配列連番作成 #1361 (core #78)', async () => {
    await cmp('1から3まで配列連番作成してJSONエンコードして表示', '[1,2,3]')
    await cmp('5から7まで配列連番作成してJSONエンコードして表示', '[5,6,7]')
  })
  it('配列関数適用 #1361 (core #78)', async () => {
    await cmp('●(Nを)二倍処理とは;それはN*2;ここまで;A=[1,2,3];Aに「二倍処理」を配列関数適用してJSONエンコードして表示。', '[2,4,6]')
    await cmp('A=[1,2,3];Aへ配列関数適用には(N)\nそれはN*2;ここまで;それをJSONエンコードして表示。', '[2,4,6]')
    await cmp('●(Nを)二倍処理とは;それはN*2;ここまで;A=[1,2,3];Aに「二倍処理」を配列マップしてJSONエンコードして表示。', '[2,4,6]')
  })
  it('配列フィルタ #1361 (core #78)', async () => {
    await cmp('●(Nを)偶数抽出とは;それは(N%2==0);ここまで;A=[1,2,3,4];Aを「偶数抽出」で配列フィルタしてJSONエンコードして表示。', '[2,4]')
    await cmp('●(Nを)偶数抽出とは;それは(N%2==0);ここまで;A=[1,2,3,4];Aについて「偶数抽出」で配列フィルタしてJSONエンコードして表示。', '[2,4]')
    await cmp('A=[1,2,3,4];Aについて配列フィルタには(N)\nそれは(N%2==0);ここまで;それをJSONエンコードして表示。', '[2,4]')
  })
})
