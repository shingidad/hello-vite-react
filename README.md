## STEP-1 : Project Init

**hello-vite** 로 프로젝트를 만듭니다.

```bash
npm init vite@latest hello-vite --template react-ts
```



### 결과

```
npx: 6개의 패키지를 2.587초만에 설치했습니다.

Scaffolding project in /Users/kimdonghyun/Workspace/Private/2_Study/hello-vite...

Done. Now run:

  cd hello-vite
  npm install
  npm run dev
```



`hello-vite` 폴더로 이동

```bash
cd hello-vite
```





## STEP-2 : module Install / 서버 실행

```bash
yarn install
```

```bash
yarn dev
```





## STEP-3 : Typescript Path Alias 설정

`baseUrl`, `paths`  추가

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  },
  "include": ["./src"]
}
```



### `vite.config.ts` 수정

수정 전에 `@types/node` 를 설치해서 `fs`, `path` 등을 사용할 수 있게한다.

```shell
yarn add -D @types/node
```



`vite.config.ts` 수정

```typescript
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { Alias, defineConfig } from "vite";

interface TSConfig {
  compilerOptions: {
    baseUrl?: string;
    paths?: {
      [key: string]: string[];
    };
  };
}

const tsConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./tsconfig.json"), "utf-8")
) as TSConfig;

const tsConfigAlias = (typeScriptConfig: TSConfig): Alias[] => {
  const aliasMap: Alias[] = [];
  for (let key in typeScriptConfig.compilerOptions.paths) {
    if (/\/\*$/.test(key)) {
      const keyWithoutStar = key.replace(/\/\*$/, "");
      const targetDir = typeScriptConfig.compilerOptions.paths[key][0].replace(
        /\/\*$/,
        ""
      );
      aliasMap.push({
        find: keyWithoutStar,
        replacement: path.join(__dirname, "/", targetDir),
      });
    } else {
      aliasMap.push({
        find: key,
        replacement: path.join(
          __dirname,
          "/",
          typeScriptConfig.compilerOptions.paths[key][0]
        ),
      });
    }
  }
  return aliasMap;
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: tsConfigAlias(tsConfig),
  },
});

```



서버 다시 실행하면 완료!

```bash
yarn dev
```





### 테스트하기

```bash
 mkdir -p src/Components src/Common
```



`src/Components/index.tsx` 생성

```bash
touch src/Components/index.tsx 
```

```tsx
// src/Components/index.tsx 
import React from "react";

export interface TestCompProps {
  count: number;
}

export const TestComp: React.FC<TestCompProps> = ({ count }) => {
  return <h1>{count}</h1>;
};

```



`src/Common/index.tsx` 생성

```shell
touch src/Common/index.ts
```

```tsx
// touch src/Common/index.ts
export const increment = (value: number): number => {
  return value + 1;
};
```



`src/App.tsx` 수정

```tsx
import { useState } from "react";
import { TestComp } from "~/Components";
import { increment } from "~/Common";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(increment(count));
  };

  return (
    <div className="App">
      <TestComp count={count} />
      <button onClick={handleClick}>increment</button>
    </div>
  );
}

export default App;
```

