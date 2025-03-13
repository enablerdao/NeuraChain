// NeuraChain固有のJavaScript機能

document.addEventListener('DOMContentLoaded', function() {
    // 特徴セクションのアニメーション
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // ロードマップのアニメーション
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    
    roadmapItems.forEach((item) => {
        item.classList.add('scroll-reveal');
    });
    
    // ヒーローセクションにニューラルネットワークのアニメーション背景を追加
    const heroSection = document.querySelector('section:first-of-type');
    
    if (heroSection) {
        heroSection.classList.add('neural-bg');
    }
    
    // Proof of AIのインタラクティブな説明
    const poaiSection = document.querySelector('#technology');
    
    if (poaiSection) {
        const poaiTitle = poaiSection.querySelector('h3:contains("Proof of AI")');
        
        if (poaiTitle) {
            const demoButton = document.createElement('button');
            demoButton.textContent = 'AIデモを見る';
            demoButton.className = 'bg-purple-600 hover:bg-purple-500 text-white rounded px-4 py-2 ml-4 text-sm focus:outline-none';
            
            poaiTitle.appendChild(demoButton);
            
            demoButton.addEventListener('click', function() {
                // AIデモのモーダルを表示
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                modal.innerHTML = `
                    <div class="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold">NeuraChain Proof of AIデモ</h3>
                            <button class="text-gray-400 hover:text-white focus:outline-none" id="close-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="mb-4">
                            <p class="text-gray-300 mb-4">このデモでは、AIモデルがブロックチェーンデータを分析し、最適なコンセンサスを形成する様子を示しています。</p>
                            <div class="bg-gray-900 p-4 rounded">
                                <div class="mb-3">
                                    <div class="text-purple-400 text-sm mb-1">AIモデルのトレーニング進捗</div>
                                    <div class="w-full bg-gray-700 rounded-full h-2.5">
                                        <div class="bg-purple-600 h-2.5 rounded-full" style="width: 85%"></div>
                                    </div>
                                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>0%</span>
                                        <span>85%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                <pre class="text-green-400 text-sm overflow-x-auto">
// Proof of AI コンセンサスデモ
Analyzing blockchain data...
Training neural network...
Epoch 42/50: Loss = 0.0342
Validating model accuracy: 99.7%
Consensus prediction: Block #12345 is valid
Verification time: 12ms
                                </pre>
                            </div>
                        </div>
                        <div class="text-right">
                            <button class="bg-purple-600 hover:bg-purple-500 text-white rounded px-4 py-2 focus:outline-none" id="close-demo">閉じる</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                document.getElementById('close-modal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
                
                document.getElementById('close-demo').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
            });
        }
    }
});