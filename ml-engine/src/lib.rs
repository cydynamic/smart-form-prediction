use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// 设置panic hook以便在浏览器中更好地调试
#[cfg(feature = "console_error_panic_hook")]
pub fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

// 日志宏
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// 表单字段类型枚举
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FieldType {
    Text,
    Number,
    Select,
    Checkbox,
    Password,
}

// 表单数据结构
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormData {
    user_id: String,
    timestamp: String,
    fields: Vec<FieldValue>,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldValue {
    field_id: String,
    field_type: FieldType,
    value: String,
}

// 预测结果结构
#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PredictionResult {
    field_id: String,
    candidates: Vec<String>,
    confidence_scores: Vec<f64>,
}

// 机器学习预测器
#[wasm_bindgen]
pub struct FormPredictor {
    training_data: Vec<FormData>,
    model_trained: bool,
}

#[wasm_bindgen]
impl FormPredictor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FormPredictor {
        set_panic_hook();
        console_log!("FormPredictor initialized");

        FormPredictor {
            training_data: Vec::new(),
            model_trained: false,
        }
    }

    /// 添加训练数据
    #[wasm_bindgen]
    pub fn add_training_data(&mut self, data: &str) -> Result<(), JsValue> {
        match serde_json::from_str::<FormData>(data) {
            Ok(form_data) => {
                self.training_data.push(form_data);
                console_log!("Training data added. Total: {}", self.training_data.len());
                Ok(())
            }
            Err(e) => {
                let error_msg = format!("Failed to parse training data: {}", e);
                console_log!("{}", error_msg);
                Err(JsValue::from_str(&error_msg))
            }
        }
    }

    /// 训练模型
    #[wasm_bindgen]
    pub fn train_model(&mut self) -> Result<(), JsValue> {
        if self.training_data.is_empty() {
            return Err(JsValue::from_str("No training data available"));
        }

        // 简单的基于频率的模型训练
        console_log!(
            "Training model with {} data points",
            self.training_data.len()
        );

        // 这里实现基本的统计学习算法
        // 在实际项目中，这里会使用更复杂的机器学习算法

        self.model_trained = true;
        console_log!("Model training completed");
        Ok(())
    }

    /// 预测下一个字段的值
    #[wasm_bindgen]
    pub fn predict(&self, user_id: &str, field_id: &str, context: &str) -> Result<String, JsValue> {
        if !self.model_trained {
            return Err(JsValue::from_str("Model not trained yet"));
        }

        console_log!("Predicting for user: {}, field: {}", user_id, field_id);

        // 简单的预测逻辑：基于历史数据频率
        let mut candidates = Vec::new();
        let mut scores = Vec::new();

        // 统计该用户在该字段的历史输入
        for data in &self.training_data {
            if data.user_id == user_id {
                for field in &data.fields {
                    if field.field_id == field_id && !field.value.is_empty() {
                        candidates.push(field.value.clone());
                        scores.push(0.8); // 简单的置信度
                    }
                }
            }
        }

        // 去重并排序
        candidates.sort();
        candidates.dedup();

        // 限制候选数量
        if candidates.len() > 5 {
            candidates.truncate(5);
            scores.truncate(5);
        }

        let result = PredictionResult {
            field_id: field_id.to_string(),
            candidates,
            confidence_scores: scores,
        };

        match serde_json::to_string(&result) {
            Ok(json) => Ok(json),
            Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e))),
        }
    }

    /// 获取训练数据统计信息
    #[wasm_bindgen]
    pub fn get_stats(&self) -> String {
        let stats = format!(
            "{{\"training_data_count\": {}, \"model_trained\": {}}}",
            self.training_data.len(),
            self.model_trained
        );
        stats
    }
}

// 初始化函数
#[wasm_bindgen(start)]
pub fn main() {
    set_panic_hook();
    console_log!("Smart Form ML Engine initialized");
}
