from app.protos import san11_platform_pb2 as pb


def on_approve(curr: int, dest: int) -> bool:
    return curr == pb.ResourceState.UNDER_REVIEW and dest == pb.ResourceState.NORMAL
