import { ChapterData } from '@/types/explainer';

export const CHAPTERS: ChapterData[] = [
  {
    id: 'ch1_data_foundations',
    number: 1,
    title: 'Data & Pipeline Foundations',
    subtitle: 'Capella SAR Amplitude Stacks & Independent InSAR Ground-Truth',
    cognitiveObjective: 'Understand why single-channel SAR amplitude is used for training while InSAR coherence is strictly preserved as an independent test evaluation reference.',
    estimatedMinutes: 8,
    steps: [
      {
        id: 'step_1_1',
        chapterId: 'ch1_data_foundations',
        title: 'Single-Channel SAR Amplitude vs. InSAR Phase Coherence',
        subtitle: 'The Core Representation Formulation',
        content: `Synthetic Aperture Radar (SAR) sensors emit microwave pulses and record backscatter response. Traditional anomaly detection often relies on Complex Interferometric SAR (InSAR) coherence $\\gamma$, which requires complex-valued phase pairs ($s_1, s_2$). However, phase data is easily lost due to temporal decorrelation, vegetation growth, or steep terrain.

**T-SAR-JEPA** breaks this limitation by operating **exclusively on single-channel SAR amplitude patches** ($224 \\times 224$). InSAR coherence is computed offline using interferometric cross-correlation and serves **strictly as an independent test evaluation ground-truth**, never seen during training or inference.`,
        mathEquations: [
          '\\gamma = \\frac{\\left| \\langle s_1 s_2^* \\rangle \\right|}{\\sqrt{\\langle |s_1|^2 \\rangle \\langle |s_2|^2 \\rangle}}, \\quad \\gamma \\in [0.0, 1.0]'
        ],
        codeSnippetId: 'coherence_py',
        highlightLines: [9, 10, 11, 12, 18, 19, 20, 25],
        activeDiagramNode: 'coherence',
        defaultParams: {
          contextWindowK: 7,
          deltaT: 14,
        },
        quiz: {
          question: 'Is InSAR coherence used during T-SAR-JEPA model training?',
          options: [
            'Yes, as an additional input channel alongside amplitude.',
            'No, it is strictly used as an independent test evaluation ground-truth.',
            'Yes, it is passed into the loss function as a target.',
            'No, it is used only during Stage 1 pretraining.'
          ],
          correctIndex: 1,
          explanation: 'T-SAR-JEPA operates exclusively on single-channel SAR amplitude. InSAR coherence is used solely for evaluation.'
        }
      },
      {
        id: 'step_1_2',
        chapterId: 'ch1_data_foundations',
        title: 'GeoTIFF Raster Patch Extraction',
        subtitle: 'Filtering Nodata and Constructing 224x224 Tensors',
        content: `Large GeoTIFF satellite rasters covering Areas of Interest (AOIs like Hawaii, LA, Pilbara) are sliced into non-overlapping $224 \\times 224$ patches. Boundary patches containing nodata values are filtered out if valid pixels fall below $95\\%$.`,
        mathEquations: [
          '\\mathbf{x} \\in \\mathbb{R}^{1 \\times 224 \\times 224}, \\quad \\text{Valid Pixel Ratio} \\ge 0.95'
        ],
        codeSnippetId: 'patch_extractor_py',
        highlightLines: [17, 24, 25, 28],
        activeDiagramNode: 'patch_extractor',
        defaultParams: {
          contextWindowK: 7,
        }
      }
    ]
  },

  {
    id: 'ch2_spatial_encoder',
    number: 2,
    title: 'Spatial Vision Transformer Encoder',
    subtitle: 'SARJEPAEncoder & 768-Dim Spatial Token Pooling',
    cognitiveObjective: 'Master how 224x224 SAR patches are tokenized into 196 spatial patch embeddings and mean-pooled into 768-dim latent vectors.',
    estimatedMinutes: 10,
    steps: [
      {
        id: 'step_2_1',
        chapterId: 'ch2_spatial_encoder',
        title: 'ViT-Base Patch Embeddings & CLS Prepending',
        subtitle: 'From Pixels to 196 Spatial Tokens',
        content: `The spatial encoder wraps the \`MaskedAutoencoderViT\` base patch16 backbone. A single-channel image patch $\\mathbf{x} \\in \\mathbb{R}^{1 \\times 224 \\times 224}$ is processed by a 2D convolution projection with $16 \\times 16$ kernel size and stride 16, resulting in $14 \\times 14 = 196$ spatial patch tokens of dimension $D=768$. A learnable CLS token is prepended, yielding $197$ tokens.`,
        mathEquations: [
          'N_{\\text{patches}} = \\left(\\frac{224}{16}\\right)^2 = 196, \\quad \\mathbf{X}_{\\text{tokens}} \\in \\mathbb{R}^{B \\times 197 \\times 768}'
        ],
        codeSnippetId: 'encoder_py',
        highlightLines: [36, 37, 39, 40],
        activeDiagramNode: 'encoder',
        defaultParams: {
          contextWindowK: 7,
        }
      },
      {
        id: 'step_2_2',
        chapterId: 'ch2_spatial_encoder',
        title: 'Spatial Mean Token Pooling',
        subtitle: 'Extracting Global Spatial Features without Position Distortion',
        content: `Tokens pass through 12 Transformer blocks with relative position encodings (iRPE). To produce a compact vector representation $\\mathbf{z} \\in \\mathbb{R}^{B \\times 768}$ for downstream temporal processing, spatial tokens (indices 1 through 196, excluding index 0 CLS) are **mean-pooled** across the spatial dimension.`,
        mathEquations: [
          '\\mathbf{z} = \\frac{1}{196} \\sum_{i=1}^{196} \\mathbf{x}_{i} \\in \\mathbb{R}^{B \\times 768}'
        ],
        codeSnippetId: 'encoder_py',
        highlightLines: [46, 47, 50, 51],
        activeDiagramNode: 'encoder',
        quiz: {
          question: 'Why are spatial tokens mean-pooled at the output of the SAR-JEPA encoder?',
          options: [
            'To double the embedding dimension from 384 to 768.',
            'To condense 196 spatial patch tokens into a single 768-dim latent vector per timestep.',
            'To flatten the image pixels into a 1D sequence.',
            'To calculate the loss function.'
          ],
          correctIndex: 1,
          explanation: 'Mean-pooling reduces the 196 spatial tokens to a single 768-dim feature vector per image timestep.'
        }
      }
    ]
  },

  {
    id: 'ch3_time_predictor',
    number: 3,
    title: 'Temporal Encodings & Causal Predictor',
    subtitle: 'Sinusoidal Time Encodings & 4-Layer Causal Transformer',
    cognitiveObjective: 'Grasp how irregular satellite acquisition timestamps are injected into latent vectors and how the temporal transformer forecasts t+1 states.',
    estimatedMinutes: 12,
    steps: [
      {
        id: 'step_3_1',
        chapterId: 'ch3_time_predictor',
        title: 'Continuous Temporal Encodings',
        subtitle: 'Sinusoidal vs. CTLPE Continuous Time Embeddings',
        content: `Satellite revisit intervals $\\Delta t$ are irregular (ranging from 1 to 14 days). Standard integer positional encodings fail. We project continuous normalized day timestamps $t \\in [0, 1]$ into $\\mathbb{R}^{768}$ space using **Sinusoidal Time Encodings** $\\gamma(\\Delta t)$ or **CTLPE** (Continuous-Time Learnable Positional Encodings).`,
        mathEquations: [
          '\\text{PE}_{(t, 2i)} = \\sin\\left(\\frac{1000 t}{10000^{2i/D}}\\right), \\quad \\text{PE}_{(t, 2i+1)} = \\cos\\left(\\frac{1000 t}{10000^{2i/D}}\\right)'
        ],
        codeSnippetId: 'time_encodings_py',
        highlightLines: [12, 13, 18, 19, 20, 21],
        activeDiagramNode: 'time_enc',
        defaultParams: {
          contextWindowK: 7,
          deltaT: 14,
        }
      },
      {
        id: 'step_3_2',
        chapterId: 'ch3_time_predictor',
        title: '4-Layer Causal Transformer Predictor',
        subtitle: 'Predicting Next Latent Representation from K Context Vectors',
        content: `The temporal predictor takes a context sequence of $K=7$ latent vectors $\\mathbf{z}_{1:K}$ plus time encodings. It passes them through a 4-layer pre-norm Transformer encoder ($d_{\\text{model}}=768, n_{\\text{heads}}=8, d_{\\text{ffn}}=2048$), mean-pools the output sequence, and projects to predict the target vector $\\hat{\\mathbf{z}}_{K+1}$.`,
        mathEquations: [
          '\\hat{\\mathbf{z}}_{K+1} = g_{\\phi}\\left( \\mathbf{z}_{1:K} + \\gamma(t_{1:K}) \\right) \\in \\mathbb{R}^{B \\times 768}'
        ],
        codeSnippetId: 'temporal_predictor_py',
        highlightLines: [18, 19, 20, 21, 31, 35, 36, 42, 43, 44],
        activeDiagramNode: 'predictor',
        defaultParams: {
          contextWindowK: 7,
        }
      }
    ]
  },

  {
    id: 'ch4_stage1_pretrain',
    number: 4,
    title: 'Stage 1: Domain Adaptation',
    subtitle: 'LoMaR Masking & EMA Target Encoder',
    cognitiveObjective: 'Learn how pre-trained SAR-JEPA weights are adapted to Capella SAR amplitude statistics via spatial masking and Exponential Moving Average target updates.',
    estimatedMinutes: 10,
    steps: [
      {
        id: 'step_4_1',
        chapterId: 'ch4_stage1_pretrain',
        title: 'Local Window Masking (LoMaR) & EMA Teacher Updates',
        subtitle: 'Masked Feature Reconstruction without Contrastive Negatives',
        content: `Stage 1 fine-tunes the spatial encoder on Capella SAR patches. It applies $70\\%$ local window masking (LoMaR) and uses multi-scale gradient feature targets (GF at kernels 5, 9, 13, 17). An Exponential Moving Average (EMA) copy of the model is updated at momentum $m=0.996$ to maintain a smooth offline target encoder.`,
        mathEquations: [
          '\\mathbf{\\theta}_{\\text{EMA}} \\leftarrow m \\mathbf{\\theta}_{\\text{EMA}} + (1 - m) \\mathbf{\\theta}_{\\text{online}}, \\quad m=0.996'
        ],
        codeSnippetId: 'pretrain_py',
        highlightLines: [5, 6, 7, 23, 28, 29],
        activeDiagramNode: 'encoder',
        defaultParams: {
          maskRatio: 0.7,
        }
      },
      {
        id: 'step_4_2',
        chapterId: 'ch4_stage1_pretrain',
        title: 'Offline Dataset Latent Feature Encoding',
        subtitle: 'Pre-encoding 768-Dim Sequences for Fast Stage 2 Training',
        content: `Once Stage 1 pretraining completes, all dataset patches are passed through the adapted frozen encoder in \`no_grad\` mode. The resulting 768-dim vectors are cached to disk as \`.npy\` files, allowing Stage 2 to train in seconds without raw image reading overhead.`,
        mathEquations: [
          'f_{\\theta}: \\mathbf{x}_{i} \\mapsto \\mathbf{z}_{i} \\in \\mathbb{R}^{768}, \\quad \\text{Saved as } \\text{patch\\_001\\_emb.npy}'
        ],
        codeSnippetId: 'encode_dataset_py',
        highlightLines: [13, 18, 21, 24],
        activeDiagramNode: 'encoder'
      }
    ]
  },

  {
    id: 'ch5_stage2_temporal',
    number: 5,
    title: 'Stage 2: Temporal Predictor Training',
    subtitle: 'Latent Vector Sequence Forecasting & Spatial Grid Splitting',
    cognitiveObjective: 'Understand lightweight vector-space training, context window creation, and spatial grid location train/val splitting.',
    estimatedMinutes: 10,
    steps: [
      {
        id: 'step_5_1',
        chapterId: 'ch5_stage2_temporal',
        title: 'Vector-Space Training & Spatial Grid Split',
        subtitle: 'Preventing Spatial Leakage across AOI Grid Coordinates',
        content: `Stage 2 trains the 4-layer temporal predictor directly on pre-encoded 768-dim embedding sequences. To prevent spatial data leakage, sequences are split 80/20 by unique spatial grid coordinate keys rather than random sampling.`,
        mathEquations: [
          '\\mathcal{L}_{\\text{Stage2}} = \\left\\| \\hat{\\mathbf{z}}_{K+1} - \\mathbf{z}_{K+1} \\right\\|_2^2'
        ],
        codeSnippetId: 'train_temporal_py',
        highlightLines: [10, 24, 25, 26, 27],
        activeDiagramNode: 'predictor',
        defaultParams: {
          contextWindowK: 7,
        }
      },
      {
        id: 'step_5_2',
        chapterId: 'ch5_stage2_temporal',
        title: 'Sliding Context Window Dataset Generator',
        subtitle: 'Constructing (K=7, 768) Inputs & Target Vector Pairs',
        content: `\`TemporalPatchDataset\` iterates over encoded time series, creating sliding context windows of size $K=7$ and target vectors at index $K+1$. Relative timestamps within each window are dynamically normalized to $[0, 1]$.`,
        mathEquations: [
          't_{\\text{norm}} = \\frac{t_i - t_{\\text{min}}}{t_{\\text{max}} - t_{\\text{min}}} \\in [0, 1]'
        ],
        codeSnippetId: 'temporal_dataset_py',
        highlightLines: [18, 19, 20, 24, 25],
        activeDiagramNode: 'time_enc'
      }
    ]
  },

  {
    id: 'ch6_stage3_unfreezing',
    number: 6,
    title: 'Stage 3: Progressive Encoder Unfreezing',
    subtitle: 'Joint End-to-End Fine-Tuning & 50x Loss Reduction',
    cognitiveObjective: 'Master the two-phase progressive unfreezing schedule that fine-tunes spatial encoder and temporal predictor jointly.',
    estimatedMinutes: 12,
    steps: [
      {
        id: 'step_6_1',
        chapterId: 'ch6_stage3_unfreezing',
        title: 'Two-Phase Progressive Encoder Unfreezing',
        subtitle: 'Unfreezing Schedule: Phase A vs. Phase B',
        content: `Stage 3 addresses the question *"Why freeze the encoder?"* by jointly fine-tuning the spatial encoder and temporal predictor end-to-end on raw patches.
- **Phase A**: Unfreezes the last 4 encoder ViT blocks + norm ($LR_{\\text{enc}} = 10^{-5}, LR_{\\text{pred}} = 10^{-4}$).
- **Phase B**: Unfreezes ALL encoder parameters ($LR_{\\text{enc}} = 5 \\times 10^{-6}, LR_{\\text{pred}} = 5 \\times 10^{-5}$).
This yields a **50x validation loss improvement** over frozen encoder baselines.`,
        mathEquations: [
          '\\text{Phase A: } \\nabla_{\\theta_{\\text{blocks}[-4:]}} \\mathcal{L}, \\quad \\text{Phase B: } \\nabla_{\\theta_{\\text{all}}} \\mathcal{L}'
        ],
        codeSnippetId: 'finetune_e2e_py',
        highlightLines: [8, 9, 10, 17, 18, 24, 25, 36, 37],
        activeDiagramNode: 'unfreezing',
        defaultParams: {
          unfreezingPhase: 'phase_a',
        },
        quiz: {
          question: 'What validation loss improvement is achieved by Stage 3 progressive unfreezing?',
          options: [
            '1.5x improvement',
            '10x improvement',
            '50x improvement',
            'No improvement'
          ],
          correctIndex: 2,
          explanation: 'Stage 3 joint progressive unfreezing achieves a 50x validation loss improvement.'
        }
      },
      {
        id: 'step_6_2',
        chapterId: 'ch6_stage3_unfreezing',
        title: 'Unified TSARJEPAPipeline Wrapper',
        subtitle: 'Sliding Window Anomaly Scoring over Raw SAR Sequences',
        content: `\`TSARJEPAPipeline\` combines the unfrozen encoder and trained temporal predictor into a single unified object that accepts raw SAR patch stacks and yields anomaly maps.`,
        mathEquations: [
          '\\text{Pipeline}: (\\mathbf{x}_{1:N}, t_{1:N}) \\mapsto A(t) \\in \\mathbb{R}^N'
        ],
        codeSnippetId: 't_sar_jepa_py',
        highlightLines: [12, 13, 28, 29],
        activeDiagramNode: 'l2_loss'
      }
    ]
  },

  {
    id: 'ch7_evaluation_metrics',
    number: 7,
    title: 'Anomaly Scoring & Evaluation Suite',
    subtitle: 'L2 Latent Distance, ROC-AUC, Permutation & Geometry Analysis',
    cognitiveObjective: 'Understand how L2 latent prediction error is computed, evaluated against InSAR coherence, and verified statistically.',
    estimatedMinutes: 12,
    steps: [
      {
        id: 'step_7_1',
        chapterId: 'ch7_evaluation_metrics',
        title: 'L2 Latent Error Anomaly Scoring',
        subtitle: 'Measuring Deviation from Temporal Norms',
        content: `Anomaly scores are calculated as the $L_2$ Euclidean distance between the predicted latent vector $\\hat{\\mathbf{z}}_{K+1}$ and the actual observed target latent vector $\\mathbf{z}_{K+1}$. Timesteps with prediction errors exceeding temporal norms indicate physical ground changes.`,
        mathEquations: [
          'A(t) = \\left\\| \\hat{\\mathbf{z}}_{K+1} - \\mathbf{z}_{K+1} \\right\\|_2 = \\sqrt{\\sum_{d=1}^{768} (\\hat{z}_d - z_d)^2}'
        ],
        codeSnippetId: 'anomaly_scorer_py',
        highlightLines: [8, 9, 25, 26, 27],
        activeDiagramNode: 'l2_loss',
        defaultParams: {
          anomalyThreshold: 0.15,
        }
      },
      {
        id: 'step_7_2',
        chapterId: 'ch7_evaluation_metrics',
        title: '1000-Shuffle Spatial Permutation Test',
        subtitle: 'Proving Non-Random Spatial Anomaly Localization (p < 0.001)',
        content: `To prove that anomaly maps localize physical ground changes rather than random noise, pixels are spatially shuffled 1,000 times to construct a null distribution. T-SAR-JEPA achieves a spatial coherence score of **99.9%** ($p < 0.001$).`,
        mathEquations: [
          'p = \\frac{1}{1000} \\sum_{i=1}^{1000} \\mathbb{I}\\left( S_{\\text{permuted}}^{(i)} \\ge S_{\\text{true}} \\right) < 0.001'
        ],
        codeSnippetId: 'permutation_test_py',
        highlightLines: [12, 13, 22, 23, 24],
        activeDiagramNode: 'l2_loss'
      },
      {
        id: 'step_7_3',
        chapterId: 'ch7_evaluation_metrics',
        title: 'ROC-AUC & Incidence Geometry Independence',
        subtitle: '77.0% ROC-AUC vs Baselines ~50% & |rho| < 0.11',
        content: `Evaluated against independent low InSAR coherence pseudo-GT ($< 0.3$), T-SAR-JEPA achieves **77.0% ROC-AUC** (compared to unsupervised baselines like RX, PaDiM, and Linear AR at $\\sim 50\\%$). Pearson correlation with satellite incidence angles is $|\\rho| < 0.11$, confirming total geometry independence.`,
        mathEquations: [
          '\\text{ROC-AUC} = 77.0\\%, \\quad |\\rho(\\text{score}, \\theta_{\\text{inc}})| < 0.11'
        ],
        codeSnippetId: 'roc_pr_py',
        highlightLines: [8, 11, 12],
        activeDiagramNode: 'l2_loss'
      }
    ]
  },

  {
    id: 'ch8_presentation_deck',
    number: 8,
    title: 'IGARSS 2026 Presentation Deck',
    subtitle: '10-Slide Blueprint & Reviewer Defense Q&A',
    cognitiveObjective: 'Rehearse the 12-minute oral presentation using assertion-evidence slides, key formula cheat-sheets, and reviewer defense flashcards.',
    estimatedMinutes: 10,
    steps: [
      {
        id: 'step_8_1',
        chapterId: 'ch8_presentation_deck',
        title: '10-Slide Assertion-Evidence Presentation Strategy',
        subtitle: 'Maximizing Cognitive Signal for IEEE GRSS Audience',
        content: `Replace bullet-point walls with single-line declarative assertion headlines supported by high-density visual evidence. Review key slides, timing benchmarks (12 min talk + 3 min Q&A), and empirical result callouts.`,
        mathEquations: [
          '\\mathcal{L}_{\\text{E2E}} = \\left\\| \\hat{\\mathbf{z}}_{t+1} - \\mathbf{z}_{t+1} \\right\\|_2^2, \\quad \\text{ROC-AUC} = 77.0\\%'
        ],
        codeSnippetId: 'geometry_analysis_py',
        highlightLines: [8, 10],
        activeDiagramNode: 'l2_loss'
      }
    ]
  }
];
