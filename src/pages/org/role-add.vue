<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small"
            label-width="135px" >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="dataForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="menuIds">
                <el-tree
                  v-model="dataForm.menuIds"
                  :data="treeData"
                  tree
                  node-key="id"
                  lab
                  ref="tree"
                  :props="props"
                  show-checkbox>
                </el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dataForm')">立即创建</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        treeData:[],
        dataForm: {
          menuIds:'',
          roleName: '',
        },
        props: {
          value: 'id',
          label: 'name',
          children: 'children'
        },
        rules: {
           roleName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 50, message: '名称长度在 1 到 20 个汉字内', trigger: 'blur' }
          ],
          sortNumber: [
            { required: true, message: '请输入排序' , trigger: 'blur'},
            { type: 'number', message: '必须为数字！' }
          ]
        }
      };
    },
    created() {
      this.initTreeData();
    },
    methods: {
      submitForm(dataForm) {
        this.dataForm.menuIds = this.$refs.tree.getCheckedKeys();
        this.$refs[dataForm].validate((valid) => {
          if (valid) {
            this.postRequest('/ms-book-user-manager/api/menuRole/addMenuRole', this.dataForm).then(resp => {
                if (resp && !resp.status) {
                    this.$router.push('/org/role-list');
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(dataForm) {
        this.$refs[dataForm].resetFields();
      },
      initTreeData(){
          // 菜单数据源
          this.getRequest('/ms-book-user-manager/api/menu/getMenuTree', {}).then(resp => {
            if (resp && !resp.status) {
              this.treeData = resp;
            }
          })
      }
    }
  }
</script>

<style scoped>
    .defaultForm {
        margin-top: 20px;
        width: 85%
    }
</style>